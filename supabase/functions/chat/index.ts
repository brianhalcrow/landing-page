
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
    console.log('Received chat request');
    const { message } = await req.json()
    
    if (!message) {
      throw new Error('No message provided');
    }
    
    console.log('User message:', message);

    // Validate AWS credentials
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const awsSecretKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = Deno.env.get('AWS_REGION');

    if (!awsAccessKeyId || !awsSecretKey || !awsRegion) {
      console.error('Missing AWS credentials');
      return new Response(
        JSON.stringify({ 
          reply: "Configuration error: AWS credentials are not properly configured. Please check the Edge Function configuration.",
          error: 'Missing AWS credentials'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    // For now, return a test response with AWS credential status
    return new Response(
      JSON.stringify({ 
        reply: "AWS credentials are properly configured. Next step is to implement Bedrock integration.",
        awsConfigured: true
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
    console.error('Error in chat function:', error);
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
