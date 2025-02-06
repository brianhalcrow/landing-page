
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
    
    if (!accessKeyId || !secretAccessKey) {
      console.error('Missing AWS US East credentials');
      return new Response(
        JSON.stringify({ 
          error: 'AWS US East credentials not properly configured'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Initializing Bedrock client');
    
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Prepare the command with a more reliable configuration
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',  // Using Claude v2 which is more stable
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `\n\nHuman: ${message}\n\nAssistant:`,
        max_tokens_to_sample: 1000,
        temperature: 0.7,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ["\n\nHuman:"],
        anthropic_version: "bedrock-2023-05-31"
      })
    });

    console.log('Sending request to Bedrock');

    // Add retry logic with exponential backoff
    const maxRetries = 3;
    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
      try {
        console.log(`Attempt ${attempt + 1} of ${maxRetries}`);
        const response = await bedrockClient.send(command);
        
        if (!response.body) {
          throw new Error('Empty response from Bedrock');
        }

        const responseText = new TextDecoder().decode(response.body);
        const parsedResponse = JSON.parse(responseText);
        const reply = parsedResponse.completion || "I apologize, but I couldn't generate a complete response.";

        console.log('Successfully generated response');

        return new Response(
          JSON.stringify({ reply: reply.trim() }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        if (error.name === 'ThrottlingException' || 
            error.message?.includes('Model is not ready')) {
          // Wait with exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
        } else {
          // If it's a different error, don't retry
          break;
        }
      }
    }

    // If we've exhausted retries or hit a non-retriable error
    console.error('All attempts failed or non-retriable error encountered');
    return new Response(
      JSON.stringify({
        error: 'Failed to generate response',
        details: lastError?.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
