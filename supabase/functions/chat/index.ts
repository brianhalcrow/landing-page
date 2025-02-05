
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
      throw new Error('AWS US East credentials not properly configured');
    }

    console.log('Initializing Bedrock client with US East credentials');
    // Initialize AWS Bedrock client with US East configuration
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      maxAttempts: 3
    });

    // Prepare the Anthropic Claude prompt 
    const anthropicPrompt = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    };

    // Call Bedrock with proper content type and response handling
    console.log('Calling Bedrock API');
    try {
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2', // or your specific imported model
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(anthropicPrompt)
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
      
      // Extract the assistant's response
      const reply = result.content?.[0]?.text || "I apologize, but I couldn't generate a response.";

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
      throw new Error(`Bedrock API error: ${bedrockError.message}`);
    }
  } catch (error) {
    console.error('Error in chat function:', error);
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

