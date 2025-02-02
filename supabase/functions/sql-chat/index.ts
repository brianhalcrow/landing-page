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

    // Create a system message that provides context about the database structure
    const systemMessage = `You are a helpful SQL assistant that helps users understand and write SQL queries for a Supabase database. 
    The database contains the following main tables:
    - entities: Stores entity information with columns like entity_id, entity_name, functional_currency
    - exposure_types: Contains exposure type configurations
    - hedge_request_draft: Stores draft hedge requests
    - hedge_request_draft_trades: Contains trade information for hedge requests
    - rates: Stores exchange rates and related data
    - trade_register: Records completed trades
    
    When helping users:
    1. Always explain the SQL concepts clearly
    2. Provide complete, working SQL examples
    3. Follow Supabase's SQL best practices
    4. Consider RLS policies when relevant
    5. Explain any potential performance implications
    
    Important: Never provide destructive queries (DROP, DELETE, etc) without explicit warnings.`;

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
      }),
    })

    const data = await response.json()

    if (!response.ok) {
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