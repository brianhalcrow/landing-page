
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { BedrockRuntimeClient, InvokeModelCommand } from "npm:@aws-sdk/client-bedrock-runtime";

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

    // Get AWS credentials specifically for US East region
    const accessKeyId = Deno.env.get('AWS_US_EAST_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_US_EAST_SECRET_ACCESS_KEY');
    const region = Deno.env.get('AWS_US_EAST_REGION') || 'us-east-1';
    
    // Comprehensive credential logging and validation
    console.log('Credential Debug:', {
      accessKeyIdPrefix: accessKeyId?.substring(0, 4) + '***',
      accessKeyIdLength: accessKeyId?.length,
      secretKeyLength: secretAccessKey?.length,
      region: region
    });

    if (!accessKeyId || !secretAccessKey) {
      console.error('Missing AWS US East credentials');
      return new Response(
        JSON.stringify({ 
          error: 'AWS US East credentials not properly configured',
          details: 'Please check AWS_US_EAST_ACCESS_KEY_ID and AWS_US_EAST_SECRET_ACCESS_KEY in Supabase Edge Function secrets'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Additional credential validation
    if (accessKeyId.length < 10 || secretAccessKey.length < 20) {
      console.error('Invalid AWS credential format');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid AWS Credentials',
          details: 'Credentials do not meet minimum length requirements'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Initializing Bedrock client with US East credentials');
    
    // Initialize AWS Bedrock client with US East configuration
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      maxAttempts: 2 // Reduce retry attempts
    });

    // Call Bedrock with imported DeepSeek Llama model
    console.log('Preparing to call DeepSeek Llama model');
    try {
    const command = new InvokeModelCommand({
        body: JSON.stringify({
          prompt: `Explain the difference between functional currency and transaction currency. 
          
          Response format:
          1. Provide a clear, concise definition of each term
          2. Give a specific example
          3. Highlight key differences
          4. Summarize in one concluding sentence`,
          max_tokens: 500,  // Adjust as needed
          temperature: 0.7,
          top_p: 0.9
        })
      });

      console.log('Sending request to Bedrock...');
      const response = await bedrockClient.send(command);
      console.log('Received Bedrock response');

      if (!response.body) {
        throw new Error('Empty response from Bedrock');
      }

      // Parse the response
      const responseBody = new TextDecoder().decode(response.body);
      console.log('Raw response body:', responseBody);

      const result = JSON.parse(responseBody);
      
      // Flexible response parsing for Llama models
      const reply = 
        result.generation || 
        result.output || 
        result.text || 
        "I apologize, but I couldn't generate a complete response.";

      return new Response(
        JSON.stringify({ reply }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );

    } catch (bedrockError) {
      console.error('Detailed Bedrock API error:', {
        name: bedrockError.name,
        message: bedrockError.message,
        code: bedrockError.code,
        stack: bedrockError.stack
      });
      
      // Specific error handling
      if (bedrockError.name === 'InvalidSignatureException') {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid AWS credentials',
            details: 'Please verify your AWS_US_EAST_ACCESS_KEY_ID and AWS_US_EAST_SECRET_ACCESS_KEY'
          }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Generic error response
      return new Response(
        JSON.stringify({ 
          error: 'Bedrock API Error',
          details: bedrockError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Unhandled error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unexpected Error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
