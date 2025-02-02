import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

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
       - Highlight important WHERE conditions

    Example response format:
    "Based on our Supabase schema, here's how to [answer user's question]...
    
    SQL Query:
    [provide the SQL query with proper JOINs and conditions]
    
    Explanation:
    [explain the query in the context of our specific schema and business logic]"`;

    console.log('Processing SQL query:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error?.message || 'Failed to get response from OpenAI')
    }

    const reply = data.choices[0].message.content

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in SQL chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})