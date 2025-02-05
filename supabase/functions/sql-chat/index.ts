
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received SQL chat request');
    const { message } = await req.json()
    console.log('User message:', message);

    // Create a detailed system message that provides comprehensive context about the database structure
    const systemMessage = `You are an SQL expert assistant focused on the Supabase database schema. You MUST use this exact schema to help users with their queries.

    DATABASE SCHEMA AND RELATIONSHIPS:

    1. Core Financial Tables:
    - hedge_request_draft: Stores draft hedge requests
      * Key columns: id, entity_id, entity_name, functional_currency, exposure_category_l1/l2/l3
      * Links to: hedge_request_draft_trades via draft_id
      * Status tracking with 'status' column (default: 'DRAFT')
    
    - hedge_request_draft_trades: Contains trade details
      * Key columns: draft_id, base_currency, quote_currency, currency_pair, trade_date, settlement_date
      * Links to: hedge_request_draft table
      * Amounts tracked via buy_amount and sell_amount

    2. Entity Management:
    - entities: Master table for entity information
      * Primary key: entity_id
      * Key columns: entity_name, functional_currency, accounting_rate_method
      * Referenced by: entity_exposure_config, hedge_request_draft
    
    - entity_exposure_config: Links entities to exposure types
      * Foreign keys: entity_id -> entities.entity_id, exposure_type_id -> exposure_types.exposure_type_id
      * Tracks active status with is_active boolean

    3. Reference Data:
    - exposure_types: Categorizes different types of exposures
      * Primary key: exposure_type_id
      * Hierarchical categories: l1, l2, l3
      * Links to: entity_exposure_config
    
    - hedge_strategy: Defines available hedging strategies
      * Links to exposure categories via exposure_category_l2
      * Provides strategy descriptions and instruments

    4. Transaction Tables:
    - trade_register: Records executed trades
      * Tracks: currency pairs, rates, amounts, dates
      * Links to entities via entity_id
    
    - rates: Stores exchange rates
      * Key columns: rate_date, base_currency, quote_currency, closing_rate
      * Used for currency conversions

    5. Financial Data:
    - gl_actual: General ledger actual transactions
      * Tracks financial transactions with currency and amounts
      * Links to entities via entity_id
    
    - gl_forecast: General ledger forecasted transactions
      * Similar structure to gl_actual
      * Additional forecast_category field

    IMPORTANT RULES:
    1. ALWAYS reference these exact tables and columns in your responses
    2. For any SQL query:
       - Include proper JOIN conditions based on the relationships above
       - Consider data types and NULL handling
       - Explain the business context of the query
    3. When explaining table relationships:
       - Reference the exact foreign key constraints
       - Explain the business logic behind the relationships
    4. For complex queries:
       - Break down the explanation into steps
       - Explain why certain tables are being joined
       - Highlight important WHERE conditions`

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
      prompt: `\n\nHuman: As an SQL expert, please help with the following request while following these guidelines:\n${systemMessage}\n\nUser request: ${message}\n\nAssistant:`,
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 0.9,
    });

    console.log('Request body:', requestBody);

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
      throw new Error(`Failed to get response from AWS Bedrock: ${error}`);
    }

    const data = await response.json();
    console.log('Bedrock response:', data);
    const reply = data.completion;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in SQL chat function:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
