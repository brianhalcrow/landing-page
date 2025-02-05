
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // Create AWS Bedrock request
    const endpoint = new URL(`https://bedrock-runtime.${AWS_REGION}.amazonaws.com/model/anthropic.claude-v2/invoke`)
    
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

    const response = await fetch(endpoint, {
      ...signedRequest,
      body: requestBody,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get response from AWS Bedrock: ${error}`);
    }

    const data = await response.json();
    const reply = data.completion;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
