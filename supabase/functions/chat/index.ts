
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

    const configuration = new Configuration({
      apiKey: openaiApiKey
    })
    const openai = new OpenAIApi(configuration)

    // Extract entity information if present
    let entityInfo = null
    try {
      const entityExtraction = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{
          role: 'system',
          content: 'Extract any entity names or IDs mentioned in the message. Return as JSON with entity_name field.'
        }, {
          role: 'user',
          content: message
        }]
      })

      if (entityExtraction.data.choices[0]?.message?.content) {
        const extractedEntity = JSON.parse(entityExtraction.data.choices[0].message.content)
        if (extractedEntity.entity_name) {
          // Get entity details including functional currency
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
    } catch (error) {
      console.error('Entity extraction failed:', error)
    }

    // Check if the message contains rate-related keywords
    const rateKeywords = ['exchange rate', 'spot rate', 'forward rate', 'currency rate', 'fx rate']
    const needsRateInfo = rateKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    let rateInfo = null
    if (needsRateInfo) {
      try {
        // Extract currency pair information using OpenAI
        const rateExtraction = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [{
            role: 'system',
            content: 'Extract currency pair information from the message. Return a JSON object with base_currency and quote_currency.'
          }, {
            role: 'user',
            content: message
          }]
        })

        if (rateExtraction.data.choices[0]?.message?.content) {
          const params = JSON.parse(rateExtraction.data.choices[0].message.content)
          
          // Query the rates table
          const { data: ratesData, error: ratesError } = await supabase
            .from('rates')
            .select('*')
            .eq('base_currency', params.base_currency)
            .eq('quote_currency', params.quote_currency)
            .order('rate_date', { ascending: false })
            .limit(1)

          if (!ratesError && ratesData && ratesData.length > 0) {
            rateInfo = ratesData[0]
            console.log('Found rate info:', rateInfo)
          }

          // Also check rates_forward for forward rates
          const { data: forwardRatesData, error: forwardRatesError } = await supabase
            .from('rates_forward')
            .select('*')
            .eq('currency_pair', `${params.base_currency}${params.quote_currency}`)
            .order('rate_date', { ascending: false })
            .limit(1)

          if (!forwardRatesError && forwardRatesData && forwardRatesData.length > 0) {
            rateInfo = {
              ...rateInfo,
              forward_rates: forwardRatesData[0]
            }
            console.log('Found forward rate info:', forwardRatesData[0])
          }
        }
      } catch (error) {
        console.error('Rate lookup failed:', error)
      }
    }

    // Check for calculation needs
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

        if (paramExtraction.data.choices[0]?.message?.content) {
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
          console.log('Calculation result:', calculationResult)
        }
      } catch (error) {
        console.error('Calculation failed:', error)
      }
    }

    // Prepare messages array for the final completion
    const messages = []

    // Add system message
    messages.push({
      role: 'system',
      content: `You are a financial expert specializing in currency risk management. Core understanding:
      1. Functional Currency: Primary currency for entity operations and reporting
      2. Transaction Currency: Currency used in individual transactions
      3. Risk Exposure: Arises from mismatches between functional and transaction currencies
      4. Rate Types: Spot (current market), Forward (future settlement), Cross rates (derived)
      
      Keep responses concise and practical. ${
        entityInfo ? `Consider that the entity ${entityInfo.entity_name} operates with ${entityInfo.functional_currency} as its functional currency.` : ''
      } ${
        rateInfo ? 'Use the provided rate information in your response.' : ''
      } ${
        calculationResult ? 'Include the calculation results in your response.' : ''
      }`
    })

    // Add user message
    messages.push({ role: 'user', content: message })

    // Add entity info if available
    if (entityInfo) {
      messages.push({
        role: 'system',
        content: `Entity information: ${JSON.stringify(entityInfo)}`
      })
    }

    // Add rate info if available
    if (rateInfo) {
      messages.push({
        role: 'system',
        content: `Latest rate information: ${JSON.stringify(rateInfo)}`
      })
    }

    // Add calculation results if available
    if (calculationResult) {
      messages.push({
        role: 'system',
        content: `Calculation results: ${JSON.stringify(calculationResult)}`
      })
    }

    console.log('Sending messages to OpenAI:', messages)

    // Generate response using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages
    })

    if (!completion.data.choices[0]?.message?.content) {
      throw new Error('No response received from OpenAI')
    }

    const reply = completion.data.choices[0].message.content

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
