
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;
const MAX_CHUNKS = 10;

async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  if (fileType === 'text/plain') {
    return atob(base64Content);
  }
  
  if (fileType === 'application/pdf') {
    const decoded = atob(base64Content);
    return decoded
      .replace(/[\x00-\x1F\x7F-\xFF]/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  throw new Error('Unsupported file type');
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length && chunks.length < MAX_CHUNKS) {
    const endIndex = Math.min(currentIndex + MAX_CHUNK_SIZE, text.length);
    const startIndex = currentIndex === 0 ? 0 : currentIndex - CHUNK_OVERLAP;
    const chunk = text.slice(startIndex, endIndex).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    
    currentIndex = endIndex;
  }

  return chunks;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Clone the request before reading the body
    const clonedReq = req.clone();
    const { action } = await clonedReq.json();
    console.log(`Processing ${action} request`);

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openaiApiKey });
    const openai = new OpenAIApi(configuration);

    // Initialize Supabase client
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
        const { file, metadata } = await req.json();
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
        for (const [index, chunk] of chunks.entries()) {
          console.log(`Processing chunk ${index + 1}/${chunks.length}`);
          
          const embeddingResponse = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: chunk,
          });

          const [{ embedding }] = embeddingResponse.data.data;
          
          const { data: documentChunk, error: insertError } = await supabaseClient
            .from('documents')
            .insert({
              content: chunk,
              embedding,
              metadata: {
                ...metadata,
                chunk: index + 1,
                totalChunks: chunks.length,
                fileName: file.name,
                fileType: file.type,
                status: 'completed'
              }
            })
            .select()
            .single();

          if (insertError) throw insertError;
          processedChunks.push(documentChunk);
        }

        result = {
          message: `Successfully processed ${processedChunks.length} chunks`,
          chunks: processedChunks
        };
        break;
      }

      case 'search': {
        const { embedding, match_threshold, match_count } = await req.json();
        console.log('Searching for similar documents with threshold:', match_threshold);
        
        const { data: searchData, error: searchError } = await supabaseClient
          .rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: match_threshold || 0.8,
            match_count: match_count || 10
          });

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }
        
        console.log('Found', searchData?.length || 0, 'matching documents');
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
