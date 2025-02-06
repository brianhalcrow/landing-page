
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Request received:', req.method);
    const { action, content, metadata } = await req.json();
    console.log(`Processing ${action} request with metadata:`, metadata);

    if (!content) {
      throw new Error('Content is required');
    }

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openaiApiKey });
    const openai = new OpenAIApi(configuration);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      throw new Error('Supabase configuration missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    let result;

    switch (action) {
      case 'store': {
        console.log('Processing content length:', content.length);
        
        // Content validation
        if (content.length === 0) {
          throw new Error('Content is empty');
        }

        // Split content if too long
        const contentChunks = [];
        for (let i = 0; i < content.length; i += MAX_CONTENT_LENGTH) {
          contentChunks.push(content.slice(i, i + MAX_CONTENT_LENGTH));
        }
        console.log(`Split content into ${contentChunks.length} chunks`);

        // Store initial document record with pending status
        const { data: initialDoc, error: insertError } = await supabaseClient
          .from('documents')
          .insert([{
            content,
            metadata: { ...metadata, status: 'pending' }
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating initial document:', insertError);
          throw insertError;
        }

        console.log('Created initial document record:', initialDoc.id);

        // Generate embedding with retry logic
        const embeddingResponse = await retryOperation(async () => {
          console.log('Generating embedding...');
          const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: contentChunks[0], // Start with first chunk
          });
          console.log('Embedding generated successfully');
          return response;
        }, RETRY_ATTEMPTS);

        const [{ embedding }] = embeddingResponse.data.data;
        console.log('Successfully generated embedding');

        // Update document with embedding and completed status
        const { data: updatedDoc, error: updateError } = await supabaseClient
          .from('documents')
          .update({
            embedding,
            metadata: { ...metadata, status: 'completed' }
          })
          .eq('id', initialDoc.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating document with embedding:', updateError);
          throw updateError;
        }

        console.log('Successfully updated document with embedding:', updatedDoc.id);
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
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error.details || 'No additional details available'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
