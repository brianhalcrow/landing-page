
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
    const { message } = await req.json()
    
    if (!message) {
      throw new Error('No message provided');
    }
    
    console.log('SQL query request:', message);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize AWS Bedrock for query understanding
    const accessKeyId = Deno.env.get('AWS_US_EAST_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_US_EAST_SECRET_ACCESS_KEY');
    const region = Deno.env.get('AWS_US_EAST_REGION') || 'us-east-1';

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS credentials');
    }

    const bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      }
    });

    // First use Bedrock to understand the query and format it properly
    const command = new InvokeModelCommand({
      modelId: 'arn:aws:bedrock:us-east-1:897729103708:imported-model/dj1b82d4nlp2',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `You are an AI assistant that helps convert natural language into SQL queries. Here are the tables available:
        - hedge_request_draft (id, entity_id, entity_name, cost_centre, functional_currency, exposure_category_l1, exposure_category_l2, exposure_category_l3, strategy_description, instrument, status, created_by, created_at, updated_at)
        - hedge_request_draft_trades (id, draft_id, buy_currency, sell_currency, trade_date, settlement_date, buy_amount, sell_amount, entity_id, entity_name, spot_rate, contract_rate, created_at, updated_at)
        - trade_register (deal_no, entity_id, entity_name, strategy, instrument, trade_date, settlement_date, counterparty, currency_pair, ccy_1, ccy_1_amount, ccy_2, ccy_2_amount, spot_rate, contract_rate, created_by, created_at, updated_at)
        
        Convert this question into a SQL query: ${message}
        
        Only return the SQL query, nothing else.`,
        max_tokens: 500,
        temperature: 0.5,
        top_p: 0.9,
        stop_sequences: ["\n\n"]
      })
    });

    console.log('Getting SQL query from Bedrock...');
    const bedResponse = await bedrockClient.send(command);
    
    if (!bedResponse.body) {
      throw new Error('Empty response from Bedrock');
    }

    const bedResponseBody = new TextDecoder().decode(bedResponse.body);
    const result = JSON.parse(bedResponseBody);
    const sqlQuery = result.generation || result.output;

    console.log('Generated SQL query:', sqlQuery);

    // Execute the SQL query using Supabase
    const { data, error: queryError } = await supabase
      .rpc('execute_sql_query', { query_text: sqlQuery })
      .single();

    if (queryError) {
      throw queryError;
    }

    // Format the response
    const formattedResponse = `Here are the results: ${JSON.stringify(data, null, 2)}`;

    return new Response(
      JSON.stringify({ reply: formattedResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in SQL chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error processing SQL query',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
