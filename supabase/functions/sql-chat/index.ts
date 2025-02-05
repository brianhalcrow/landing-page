
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
    console.log('Received SQL chat request');
    const { message } = await req.json()
    
    if (!message) {
      throw new Error('No message provided');
    }
    
    console.log('User message:', message);

    // Get AWS credentials from environment variables
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const region = 'us-east-1';

    if (!accessKeyId || !secretAccessKey) {
      console.error('Missing AWS credentials');
      throw new Error('AWS credentials not properly configured');
    }

    console.log('Initializing Bedrock client');

    // Initialize AWS Bedrock client
    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      maxAttempts: 3
    });

    // Prepare the prompt with your custom model format
    const promptData = {
      prompt: `You are an AI assistant specializing in SQL and database management. ${message}`,
      max_tokens: 1024,
      temperature: 0.7
    };

    // Call Bedrock with proper content type and response handling
    console.log('Calling Bedrock API with region:', region);
    try {
      const command = new InvokeModelCommand({
        modelId: 'arn:aws:bedrock:us-east-1:897729103708:imported-model/dj1b82d4nlp2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(promptData)
      });

      console.log('Sending request to Bedrock...');
      const response = await bedrockClient.send(command);
      console.log('Received Bedrock response');

      if (!response.body) {
        throw new Error('Empty response from Bedrock');
      }

      // Parse the response
      const responseBody = new TextDecoder().decode(response.body);
      console.log('Response body:', responseBody);
      const result = JSON.parse(responseBody);
      
      // Extract the response based on your model's output format
      const reply = result.completion || result.generated_text || result.response || "I apologize, but I couldn't generate a response. Please try again.";

      return new Response(
        JSON.stringify({ reply }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (bedrockError) {
      console.error('Bedrock API error:', bedrockError);
      if (bedrockError.name === 'InvalidSignatureException') {
        console.error('Invalid AWS credentials - please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
      }
      throw new Error(`Bedrock API error: ${bedrockError.message}`);
    }

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
