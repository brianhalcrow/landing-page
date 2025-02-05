
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { SignatureV4 } from 'https://deno.land/x/aws_sign_v4@1.0.2/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const AWS_ACCESS_KEY = Deno.env.get('AWS_ACCESS_KEY_ID')
const AWS_SECRET_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY')
const AWS_REGION = Deno.env.get('AWS_REGION')
const MODEL_ID = 'dj1b82d4nlp2'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    // Validate AWS credentials
    if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_REGION) {
      console.error('Missing AWS credentials');
      throw new Error('AWS credentials not configured');
    }

    console.log('Received chat request');
    const { message } = await req.json()
    
    if (!message) {
      throw new Error('No message provided');
    }
    
    console.log('User message:', message);

    // Create AWS Bedrock request
    const endpoint = new URL(`https://bedrock-runtime.${AWS_REGION}.amazonaws.com/model/imported-model/${MODEL_ID}/invoke`)
    console.log('Endpoint URL:', endpoint.toString());
    
    const signer = new SignatureV4({
      service: 'bedrock',
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
      sha256: async (data) => {
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
        return Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      },
      applyChecksum: async (_) => {},
    });

    const requestBody = JSON.stringify({
      prompt: `\n\nHuman: ${message}\n\nAssistant:`,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
    });

    console.log('Request body:', requestBody);

    try {
      const signedRequest = await signer.sign({
        method: 'POST',
        hostname: endpoint.hostname,
        path: endpoint.pathname,
        headers: {
          'Content-Type': 'application/json',
          host: endpoint.hostname,
        },
        body: requestBody,
      });

      console.log('Making request to Bedrock');
      const response = await fetch(endpoint, {
        ...signedRequest,
        body: requestBody,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Bedrock API error:', error);
        throw new Error(`Bedrock API error: ${error}`);
      }

      const data = await response.json();
      console.log('Bedrock response:', data);
      
      if (!data.completion) {
        throw new Error('Invalid response from Bedrock API');
      }
      
      return new Response(
        JSON.stringify({ reply: data.completion }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          },
          status: 200
        }
      );
    } catch (bedrockError) {
      console.error('Bedrock API call failed:', bedrockError);
      throw new Error(`Failed to communicate with Bedrock: ${bedrockError.message}`);
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
