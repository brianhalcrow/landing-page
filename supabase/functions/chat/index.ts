
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from "https://esm.sh/openai@4.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Received message:', message)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key missing')
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Extract currency pair and tenor from message
    const currencyExtraction = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: 'system',
        content: 'Extract currency pair and tenor (in days) information from the message. Return as JSON with base_currency, quote_currency, and tenor fields.'
      }, {
        role: 'user',
        content: message
      }]
    })

    let rateInfo = null
    let forwardRateInfo = null
    
    if (currencyExtraction.choices[0]?.message?.content) {
      const params = JSON.parse(currencyExtraction.choices[0].message.content)
      console.log('Extracted currency info:', params)

      // Get spot rate
      const { data: ratesData, error: ratesError } = await supabase
        .from('rates')
        .select('*')
        .eq('base_currency', params.base_currency)
        .eq('quote_currency', params.quote_currency)
        .order('rate_date', { ascending: false })
        .limit(1)

      if (!ratesError && ratesData && ratesData.length > 0) {
        rateInfo = ratesData[0]
        console.log('Found spot rate:', rateInfo)
      }

      // Get forward rate
      const { data: forwardRatesData, error: forwardRatesError } = await supabase
        .from('rates_forward')
        .select('*')
        .eq('currency_pair', `${params.base_currency}${params.quote_currency}`)
        .order('rate_date', { ascending: false })
        .limit(1)

      if (!forwardRatesError && forwardRatesData && forwardRatesData.length > 0) {
        forwardRateInfo = forwardRatesData[0]
        console.log('Found forward rate:', forwardRateInfo)
      }
    }

    // Extract entity information if present
    const entityExtraction = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: 'system',
        content: 'Extract any entity names mentioned in the message. Return as JSON with entity_name field.'
      }, {
        role: 'user',
        content: message
      }]
    })

    let entityInfo = null
    if (entityExtraction.choices[0]?.message?.content) {
      const extractedEntity = JSON.parse(entityExtraction.choices[0].message.content)
      if (extractedEntity.entity_name) {
        const { data: entityData, error: entityError } = await supabase
          .from('entities')
          .select('*')
          .eq('entity_name', extractedEntity.entity_name)
          .single()

        if (!entityError && entityData) {
          entityInfo = entityData
          console.log('Found entity:', entityData)
        }
      }
    }

    // Prepare final chat completion messages
    const messages = [
      {
        role: 'system',
        content: `You are a financial expert specializing in FX risk management. When discussing rates:
        - Always reference actual rates from the database when available
        - For spot rates, use the closing_rate from the rates table
        - For forward rates, use the all_in_rate from rates_forward table
        - If calculating forward points, it's the difference between forward and spot rates
        - Include the rate date in your response for context
        ${entityInfo ? `The entity ${entityInfo.entity_name} operates with ${entityInfo.functional_currency} as its functional currency.` : ''}
        ${rateInfo ? `Current spot rate data available as of ${rateInfo.rate_date}` : ''}
        ${forwardRateInfo ? `Forward rate data available as of ${forwardRateInfo.rate_date}` : ''}`
      },
      { role: 'user', content: message }
    ]

    if (rateInfo) {
      messages.push({
        role: 'system',
        content: `Spot rate information: ${JSON.stringify(rateInfo)}`
      })
    }

    if (forwardRateInfo) {
      messages.push({
        role: 'system',
        content: `Forward rate information: ${JSON.stringify(forwardRateInfo)}`
      })
    }

    console.log('Sending messages to OpenAI:', messages)

    // Generate final response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages
    })

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response received from OpenAI')
    }

    const reply = completion.choices[0].message.content

    console.log('Generated reply:', reply)

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
