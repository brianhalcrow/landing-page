
import "https://deno.land/x/xhr@0.3.1/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from './cors-headers.ts';
import { DocumentProcessor } from './document-processor.ts';
import { SearchProcessor } from './search-processor.ts';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openaiApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required configuration missing');
    }

    let result;

    switch (action) {
      case 'store': {
        const { file, metadata } = body;
        const docProcessor = new DocumentProcessor(openaiApiKey, supabaseUrl, supabaseServiceKey);
        result = await docProcessor.processDocument(file, metadata);
        break;
      }

      case 'search': {
        const { query, match_threshold, match_count } = body;
        const searchProcessor = new SearchProcessor(openaiApiKey, supabaseUrl, supabaseServiceKey);
        result = await searchProcessor.search(query, match_threshold, match_count);
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    const executionTime = Date.now() - startTime;
    console.log(`Operation completed in ${executionTime}ms`);

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
