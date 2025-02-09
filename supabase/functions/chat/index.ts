
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, context } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Check if the message contains calculation-related keywords
    const calculationKeywords = ['calculate', 'forward rate', 'cash flow', 'forward points']
    const needsCalculation = calculationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    let calculationResult = null
    if (needsCalculation) {
      try {
        // Extract calculation parameters using OpenAI
        const paramExtraction = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [{
            role: 'system',
            content: 'Extract calculation parameters from the user message. Return a JSON object with: category (fx_forward), amount, base_currency, quote_currency, forward_rate, and days_to_settlement.'
          }, {
            role: 'user',
            content: message
          }]
        })

        const params = JSON.parse(paramExtraction.data.choices[0].message.content)
        
        // Call calculation function
        const calcResponse = await fetch(`${supabaseUrl}/functions/v1/calculate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        })

        calculationResult = await calcResponse.json()
      } catch (error) {
        console.error('Calculation failed:', error)
      }
    }

    // Generate response using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: 'system',
          content: `You are a financial expert. Keep responses concise and practical. ${
            calculationResult ? 'Include the calculation results in your response.' : ''
          }`
        },
        { role: 'user', content: message },
        calculationResult ? {
          role: 'system',
          content: `Calculation results: ${JSON.stringify(calculationResult)}`
        } : null
      ].filter(Boolean)
    })

    const reply = completion.data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
