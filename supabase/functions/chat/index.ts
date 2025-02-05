
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

    // Initialize AWS Bedrock client
    const bedrockClient = new BedrockRuntimeClient({
      region: Deno.env.get('AWS_REGION'),
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    console.log('Initialized Bedrock client');

    // Prepare the prompt for hedging-related queries
    const prompt = {
      prompt: `\nHuman: You are an AI assistant specializing in hedging strategies and financial risk management. Please help with this query: ${message}\n\nAssistant:`,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      stop_sequences: ["\n\nHuman:"]
    };

    // Call Bedrock
    console.log('Calling Bedrock API');
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(prompt)
    });

    const response = await bedrockClient.send(command);
    console.log('Received Bedrock response');

    // Parse the response
    const responseBody = new TextDecoder().decode(response.body);
    const result = JSON.parse(responseBody);
    
    // Extract the assistant's response
    const reply = result.completion || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ reply }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
