
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('Received SQL chat request');
    const { message } = await req.json()
    
    if (!message) {
      throw new Error('No message provided');
    }
    
    console.log('User message:', message);

    // Simple response for testing connectivity
    return new Response(
      JSON.stringify({ 
        reply: "This is a test response from the SQL chat function. If you see this, the basic connectivity is working." 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in SQL chat function:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

