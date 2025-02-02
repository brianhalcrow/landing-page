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
    const systemMessage = `You are a helpful SQL assistant specializing in hedge request and financial data queries. You have access to the following database structure:

    Key Tables and Their Important Columns:

    1. hedge_request_draft:
       - id: Primary key
       - entity_id: References entities table
       - entity_name: Name of the entity
       - functional_currency: Currency code
       - exposure_category_l1, l2, l3: Exposure categorization
       - strategy_description: Description of hedge strategy
       - instrument: Type of financial instrument
       - status: Current status of the draft
       - created_by, created_at, updated_at: Audit fields

    2. hedge_request_draft_trades:
       - id: Primary key
       - draft_id: References hedge_request_draft
       - base_currency, quote_currency: Currency pair information
       - currency_pair: Combined currency pair
       - trade_date, settlement_date: Important dates
       - buy_amount, sell_amount: Transaction amounts

    3. entities:
       - entity_id: Primary key
       - entity_name: Name of the entity
       - functional_currency: Base currency for the entity
       - accounting_rate_method: Method used for accounting
       - is_active: Entity status

    4. exposure_types:
       - exposure_type_id: Primary key
       - exposure_category_l1, l2, l3: Hierarchical categorization
       - subsystem: Related subsystem
       - is_active: Status flag

    5. trade_register:
       - Contains executed trades with details like currency pairs, rates, and amounts
       - Includes entity information and trade execution details

    When helping users:
    1. You can query these tables to provide information about hedge requests, trades, and entities
    2. Use appropriate joins when relating data between tables
    3. Consider the relationships between entities and their hedge requests
    4. Help users understand exposure categories and trade details
    5. Provide clear explanations of any SQL concepts used

    Remember:
    - Always explain your queries
    - Use proper table relationships
    - Consider data types when writing queries
    - Avoid destructive operations
    - Focus on helping users understand their hedge request data`;

    console.log('Sending request to OpenAI with message:', message);

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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()
    console.log('Received response from OpenAI:', data);

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