
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

    // Validate AWS credentials
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const region = Deno.env.get('AWS_REGION');

    if (!accessKeyId || !secretAccessKey || !region) {
      console.error('Missing AWS credentials');
      throw new Error('AWS credentials not properly configured');
    }

    // Initialize AWS Bedrock client with explicit credentials
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log('Initialized Bedrock client');

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

    // Call Bedrock with proper content type
    console.log('Calling Bedrock API');
    try {
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: '*/*',
        body: JSON.stringify(anthropicPrompt)
      });

      const response = await bedrockClient.send(command);
      console.log('Received Bedrock response');

      // Parse the response
      const responseBody = new TextDecoder().decode(response.body);
      console.log('Response body:', responseBody);
      const result = JSON.parse(responseBody);
      
      // Extract the assistant's response
      const reply = result.messages?.[0]?.content || "I apologize, but I couldn't generate a response. Please try again.";

      return new Response(
        JSON.stringify({ reply }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (bedrockError) {
      console.error('Bedrock API error:', bedrockError);
      throw new Error(`Bedrock API error: ${bedrockError.message}`);
    }

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

