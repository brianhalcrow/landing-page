
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
      maxAttempts: 3, // Increased retry attempts
    });

    // Call Bedrock with imported DeepSeek Llama model
    console.log('Preparing to call DeepSeek Llama model');
    try {
      const command = new InvokeModelCommand({
        modelId: 'arn:aws:bedrock:us-east-1:897729103708:imported-model/dj1b82d4nlp2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: message,
          max_tokens: 2048,
          temperature: 0.5,
          top_p: 0.9,
          stop_sequences: ["\n\n"],
          stream: false
        })
      });

      // Add exponential backoff retry logic
      let maxRetries = 3;
      let retryCount = 0;
      let lastError;

      while (retryCount < maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
          const response = await bedrockClient.send(command);
          console.log('Received Bedrock response');

          if (!response.body) {
            throw new Error('Empty response from Bedrock');
          }

          // Parse the response
          const responseBody = new TextDecoder().decode(response.body);
          console.log('Raw response body:', responseBody);

          const result = JSON.parse(responseBody);
          const reply = result.generation || result.output || "I apologize, but I couldn't generate a complete response.";

          return new Response(
            JSON.stringify({ reply }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          lastError = error;
          
          // Check if error is related to model not being ready
          if (error.message?.includes('Model is not ready for inference')) {
            // Wait with exponential backoff before retrying
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            console.log(`Model not ready, waiting ${delay}ms before retry`);
            await new Promise(resolve => setTimeout(resolve, delay));
            retryCount++;
          } else {
            // If it's a different error, don't retry
            throw error;
          }
        }
      }

      // If we've exhausted retries, throw the last error
      if (lastError) {
        throw lastError;
      }

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
      
      // Model not ready error
      if (bedrockError.message?.includes('Model is not ready for inference')) {
        return new Response(
          JSON.stringify({ 
            error: 'Model Temporarily Unavailable',
            details: 'The AI model is currently initializing. Please try again in a few moments.'
          }),
          { 
            status: 503,
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
