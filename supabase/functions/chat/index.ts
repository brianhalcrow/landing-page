
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from "https://esm.sh/openai@4.24.1"
import { getSchemaContext } from './schema-service.ts'
import { extractCurrencyInfo, extractEntityInfo, generateChatResponse } from './openai-service.ts'
import { getRateInfo, getForwardRateInfo, getEntityInfo } from './data-service.ts'

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

    // Get schema context
    const schemaContext = await getSchemaContext(supabase)
    console.log('Schema context created')

    // Extract currency information
    const currencyInfo = await extractCurrencyInfo(openai, message, schemaContext)
    console.log('Extracted currency info:', currencyInfo)

    // Get rate information if currency was extracted
    let rateInfo = null
    let forwardRateInfo = null
    if (currencyInfo) {
      rateInfo = await getRateInfo(supabase, currencyInfo)
      forwardRateInfo = await getForwardRateInfo(supabase, currencyInfo)
      console.log('Found rate info:', { rateInfo, forwardRateInfo })
    }

    // Extract and get entity information
    const extractedEntity = await extractEntityInfo(openai, message, schemaContext)
    const entityInfo = extractedEntity ? await getEntityInfo(supabase, extractedEntity) : null
    console.log('Found entity info:', entityInfo)

    // Prepare context for final chat completion
    const context = `You are a financial expert specializing in FX risk management. You have access to the following database schema:\n\n${schemaContext}\n\nWhen discussing rates:
    - Always reference actual rates from the database when available
    - For spot rates, use the closing_rate from the rates table
    - For forward rates, use the all_in_rate from rates_forward table
    - If calculating forward points, it's the difference between forward and spot rates
    - Include the rate date in your response for context
    ${entityInfo ? `The entity ${entityInfo.entity_name} operates with ${entityInfo.functional_currency} as its functional currency.` : ''}
    ${rateInfo ? `Current spot rate data available as of ${rateInfo.rate_date}` : ''}
    ${forwardRateInfo ? `Forward rate data available as of ${forwardRateInfo.rate_date}` : ''}
    ${rateInfo ? `\nSpot rate information: ${JSON.stringify(rateInfo)}` : ''}
    ${forwardRateInfo ? `\nForward rate information: ${JSON.stringify(forwardRateInfo)}` : ''}`

    // Generate final response
    const reply = await generateChatResponse(openai, message, context)
    console.log('Generated reply')

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
