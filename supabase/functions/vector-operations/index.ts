
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHUNK_SIZE = 400;  // Keep smaller chunk size
const CHUNK_OVERLAP = 50;  // Keep reduced overlap
const MIN_CHUNK_LENGTH = 50; // Minimum characters for a meaningful chunk

async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  try {
    let text = '';
    
    if (fileType === 'text/plain') {
      text = atob(base64Content);
    } else if (fileType === 'application/pdf') {
      // Improved PDF text extraction
      const decoded = atob(base64Content);
      
      // Clean up PDF text content
      text = decoded
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters but keep newlines
        .replace(/[\uFFFD\uFFFE\uFFFF]/g, '') // Remove Unicode replacement characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n') // Add newlines after sentence endings
        .trim();

      // Basic validation of extracted text
      if (!text || text.length < 10 || !/[a-zA-Z]/.test(text)) {
        throw new Error('No valid text content could be extracted from the PDF');
      }

      // Remove any remaining non-printable characters
      text = text.replace(/[^\x20-\x7E\n]/g, '');
    } else {
      throw new Error('Unsupported file type');
    }

    // Validate the extracted text
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the file');
    }

    console.log('Extracted text sample:', text.substring(0, 200));
    console.log('Total text length:', text.length);
    
    // Check for text quality
    const wordCount = text.split(/\s+/).length;
    console.log('Word count:', wordCount);
    
    if (wordCount < 5) {
      throw new Error('Extracted text appears to be invalid or corrupted');
    }

    return text;
  } catch (error) {
    console.error('Error processing file content:', error);
    throw error;
  }
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Find the end of the current chunk
    let endIndex = Math.min(currentIndex + CHUNK_SIZE, text.length);
    
    // Try to find a natural break point (period, question mark, or exclamation mark)
    const naturalBreakIndex = text.substring(currentIndex, endIndex + 20)
      .search(/[.!?]\s/);
    
    if (naturalBreakIndex > 0 && (currentIndex + naturalBreakIndex) < text.length) {
      endIndex = currentIndex + naturalBreakIndex + 1;
    }

    // Get the chunk with overlap
    const startIndex = currentIndex === 0 ? 0 : currentIndex - CHUNK_OVERLAP;
    const chunk = text.slice(startIndex, endIndex).trim();
    
    // Only add chunks that have meaningful content
    if (chunk.length >= MIN_CHUNK_LENGTH) {
      chunks.push(chunk);
    }
    
    currentIndex = endIndex;
  }

  console.log(`Split content into ${chunks.length} chunks`);
  return chunks;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Clone the request before reading it
    const reqClone = req.clone();
    const bodyText = await reqClone.text();
    console.log('Received request:', req.method);
    console.log('Request body:', bodyText);
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid JSON in request body');
    }

    const { action } = body;
    console.log('Action:', action);

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
        console.log('Sample of extracted text:', extractedText.substring(0, 200));
        
        const chunks = chunkText(extractedText);
        console.log(`Split content into ${chunks.length} chunks`);

        const processedChunks = [];
        for (const [index, chunk] of chunks.entries()) {
          console.log(`Processing chunk ${index + 1}/${chunks.length}, size: ${chunk.length}`);
          console.log('Chunk sample:', chunk.substring(0, 100));
          
          try {
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
                  chunkSize: chunk.length,
                  fileName: file.name,
                  fileType: file.type,
                  status: 'completed'
                }
              })
              .select()
              .single();

            if (insertError) throw insertError;
            processedChunks.push(documentChunk);
            
          } catch (error) {
            console.error(`Error processing chunk ${index + 1}:`, error);
            throw error;
          }
        }

        result = {
          message: `Successfully processed ${processedChunks.length} chunks`,
          chunks: processedChunks
        };
        break;
      }

      case 'search': {
        const { query, match_threshold, match_count } = body;
        console.log('Processing search with query:', query);
        
        if (!query) {
          throw new Error('Search query is required');
        }

        // Get embedding for the search query
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: query,
        });

        const [{ embedding }] = embeddingResponse.data.data;
        
        console.log('Generated embedding for search query');

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
