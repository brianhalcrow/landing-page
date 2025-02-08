import "https://deno.land/x/xhr@0.3.1/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { corsHeaders } from './cors-headers.ts';
import { processFileContent } from './text-processor.ts';
import { chunkText } from './text-chunker.ts';

const BATCH_SIZE = 5; // Process chunks in smaller batches

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting vector-operations function');
    const startTime = Date.now();

    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const { action } = body;
    console.log('Action:', action);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openaiApiKey });
    const openai = new OpenAIApi(configuration);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    let result;

    switch (action) {
      case 'store': {
        const { file, metadata } = body;
        console.log('Processing store action for file:', file?.name);
        
        if (!file?.content) {
          throw new Error('File content is required');
        }

        console.log('Processing file content');
        const extractedText = await processFileContent(file.content, file.type);
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text could be extracted from the file');
        }

        console.log('Text extracted, length:', extractedText.length);
        
        const chunks = chunkText(extractedText);
        console.log(`Split content into ${chunks.length} chunks`);

        const processedChunks = [];
        
        // Process chunks in batches
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
          const batch = chunks.slice(i, i + BATCH_SIZE);
          console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
          
          const batchPromises = batch.map(async (chunk, batchIndex) => {
            const index = i + batchIndex;
            try {
              const embeddingResponse = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: chunk.slice(0, 8000), // Limit input size
              });

              const [{ embedding }] = embeddingResponse.data.data;
              
              return supabaseClient
                .from('documents')
                .insert({
                  content: chunk,
                  embedding,
                  metadata: {
                    ...metadata,
                    chunk: index + 1,
                    totalChunks: chunks.length,
                    chunkSize: chunk.length,
                    fileName: file.name,
                    fileType: file.type,
                    status: 'completed'
                  }
                })
                .select()
                .single();
            } catch (error) {
              console.error(`Error processing chunk ${index + 1}:`, error);
              throw error;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          processedChunks.push(...batchResults.map(result => result.data));
          
          // Add a small delay between batches to prevent rate limiting
          if (i + BATCH_SIZE < chunks.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        result = {
          message: `Successfully processed ${processedChunks.length} chunks`,
          chunks: processedChunks
        };
        break;
      }

      case 'search': {
        const { query, match_threshold = 0.7, match_count = 3 } = body;
        console.log('Processing search with query:', query);
        
        if (!query) {
          throw new Error('Search query is required');
        }

        // Set a timeout for the embedding request
        const embedTimeout = 10000; // 10 seconds
        const embedPromise = openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: query.slice(0, 1000), // Limit query length
        });

        const embeddingResponse = await Promise.race([
          embedPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Embedding request timeout')), embedTimeout)
          )
        ]);

        const [{ embedding }] = embeddingResponse.data.data;
        
        console.log('Generated embedding for search query');

        // Add limits to the RPC call
        const { data: searchData, error: searchError } = await supabaseClient
          .rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: match_threshold,
            match_count: Math.min(match_count, 5) // Never return more than 5 matches
          });

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }
        
        console.log('Found', searchData?.length || 0, 'matching documents');
        
        // Log execution time
        const executionTime = Date.now() - startTime;
        console.log(`Search completed in ${executionTime}ms`);
        
        result = searchData;
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'If this error persists, try reducing the size of your document or processing it in smaller parts.'
      }),
      { 
        status: error.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
