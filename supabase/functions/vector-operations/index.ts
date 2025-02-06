
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_CONTENT_LENGTH = 10000; // Maximum characters to process at once
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation(operation: () => Promise<any>, attempts: number): Promise<any> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === attempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

async function processFileContent(base64Content: string, fileType: string): Promise<string> {
  // For text files, simply decode the base64
  if (fileType === 'text/plain') {
    return atob(base64Content);
  }
  
  // For PDFs, we'll use a text-based approach to extract content
  // This is a simplified approach that might not work for all PDFs,
  // but it avoids the complexity of PDF.js
  if (fileType === 'application/pdf') {
    const decoded = atob(base64Content);
    // Basic text extraction - this won't work perfectly for all PDFs
    // but it's a starting point that doesn't require external dependencies
    return decoded
      .replace(/[\x00-\x1F\x7F-\xFF]/g, '') // Remove non-printable chars
      .replace(/\\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  throw new Error('Unsupported file type');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, file, metadata } = await req.json();
    console.log(`Processing ${action} request for file:`, file?.name);

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
        if (!file?.content) {
          throw new Error('File content is required');
        }

        // Process the file content
        console.log('Processing file content');
        const extractedText = await processFileContent(file.content, file.type);
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text could be extracted from the file');
        }

        console.log('Text extracted, length:', extractedText.length);

        // Split content if too long
        const contentChunks = [];
        for (let i = 0; i < extractedText.length; i += MAX_CONTENT_LENGTH) {
          contentChunks.push(extractedText.slice(i, i + MAX_CONTENT_LENGTH));
        }
        console.log(`Split content into ${contentChunks.length} chunks`);

        // Store initial document record
        const { data: initialDoc, error: insertError } = await supabaseClient
          .from('documents')
          .insert([{
            content: extractedText,
            metadata: { ...metadata, status: 'processing' }
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        // Generate embedding
        const embeddingResponse = await retryOperation(async () => {
          console.log('Generating embedding...');
          const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: contentChunks[0], // Start with first chunk
          });
          return response;
        }, RETRY_ATTEMPTS);

        const [{ embedding }] = embeddingResponse.data.data;

        // Update document with embedding
        const { data: updatedDoc, error: updateError } = await supabaseClient
          .from('documents')
          .update({
            embedding,
            metadata: { ...metadata, status: 'completed' }
          })
          .eq('id', initialDoc.id)
          .select()
          .single();

        if (updateError) throw updateError;

        result = updatedDoc;
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
