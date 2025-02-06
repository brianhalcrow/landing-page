
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content, metadata, embedding, match_threshold, match_count } = await req.json();
    console.log(`Processing ${action} request with metadata:`, metadata);

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    let result;

    switch (action) {
      case 'store':
        console.log('Generating embedding for content length:', content.length);
        
        // Generate embedding using OpenAI
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: content,
        });
        
        const [{ embedding: generatedEmbedding }] = embeddingResponse.data.data;
        console.log('Successfully generated embedding');

        // Store document with embedding
        const { data: insertData, error: insertError } = await supabaseClient
          .from('documents')
          .insert([
            {
              content,
              metadata,
              embedding: generatedEmbedding
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting document:', insertError);
          throw insertError;
        }
        
        console.log('Successfully stored document with ID:', insertData.id);
        result = insertData;
        break;

      case 'search':
        console.log('Searching for similar documents with threshold:', match_threshold);
        // Search for similar documents
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
