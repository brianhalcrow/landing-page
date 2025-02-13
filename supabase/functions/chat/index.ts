
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from "https://esm.sh/openai@4.24.1"
import { getSchemaContext } from './schema-service.ts'
import { extractCurrencyInfo, extractEntityInfo, generateChatResponse } from './openai-service.ts'
import { getRateInfo, getForwardRateInfo, getEntityInfo, getEntityExposureTypes } from './data-service.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { message, context = '', previousMessages = [] } = await req.json()
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

    // First, try to detect if this is a SQL query request
    const sqlDetectionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: 'You are a SQL detection assistant. Respond with "true" if the user is asking for data that would require querying the database (asking about trades, rates, entities, etc.), otherwise respond with "false". Respond with ONLY "true" or "false", no other text.'
        },
        { role: 'user', content: message }
      ]
    });

    const requiresSQL = sqlDetectionResponse.choices[0]?.message?.content?.toLowerCase() === 'true';

    let sqlResults = null;
    if (requiresSQL) {
      console.log('Message requires SQL query, generating SQL');
      
      // Generate SQL query
      const sqlGeneration = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: 'system',
            content: `You are a SQL query generator. Generate a SINGLE SQL query based on the user's request. You have access to the following schema:\n\n${schemaContext}\n\nOnly return the SQL query, no other text or explanation. The query should be safe and not use any DDL or DML operations. Only use SELECT statements.`
          },
          { role: 'user', content: message }
        ]
      });

      const sqlQuery = sqlGeneration.choices[0]?.message?.content;
      console.log('Generated SQL query:', sqlQuery);

      if (sqlQuery) {
        // Execute the query using Supabase's RPC function
        const { data, error } = await supabase.rpc('execute_sql_query', {
          query_text: sqlQuery
        });

        if (error) {
          console.error('Error executing SQL:', error);
          throw error;
        }

        sqlResults = data;
        console.log('SQL query results:', sqlResults);
      }
    }

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

    // Get exposure types for the entity if available
    let exposureTypes = null
    if (entityInfo?.entity_id) {
      exposureTypes = await getEntityExposureTypes(supabase, entityInfo.entity_id)
      console.log('Found exposure types:', exposureTypes)
    }

    // Prepare enhanced context including SQL results if available
    const enhancedContext = `You are a financial expert specializing in FX risk management. You have access to the following information:\n\n
    Schema Context: ${schemaContext}\n
    ${entityInfo ? `Entity ${entityInfo.entity_name} operates with ${entityInfo.functional_currency} as its functional currency.` : ''}\n
    ${rateInfo ? `Current spot rate data available as of ${rateInfo.rate_date}` : ''}\n
    ${forwardRateInfo ? `Forward rate data available as of ${forwardRateInfo.rate_date}` : ''}\n
    ${rateInfo ? `\nSpot rate information: ${JSON.stringify(rateInfo)}` : ''}\n
    ${forwardRateInfo ? `\nForward rate information: ${JSON.stringify(forwardRateInfo)}` : ''}\n
    ${sqlResults ? `\nQuery results: ${JSON.stringify(sqlResults)}` : ''}\n\n
    When discussing rates:
    - Always reference actual rates from the database when available
    - For spot rates, use the closing_rate from the rates table
    - For forward rates, use the all_in_rate from rates_forward table
    - If calculating forward points, it's the difference between forward and spot rates
    - Include the rate date in your response for context
    ${context ? `\nAdditional context: ${context}` : ''}`

    // Generate final response with exposure types context
    const reply = await generateChatResponse(openai, message, enhancedContext, exposureTypes)
    console.log('Generated reply')

    // Generate suggested follow-up questions
    const suggestionsResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: 'Based on the conversation, suggest 3 relevant follow-up questions that the user might want to ask. Return ONLY an array of strings, no other text or formatting.'
        },
        { role: 'user', content: `Previous message: ${message}\nYour response: ${reply}` }
      ]
    });

    let suggestedQuestions;
    try {
      const content = suggestionsResponse.choices[0]?.message?.content || '[]';
      // Remove any markdown formatting if present
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      suggestedQuestions = JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      suggestedQuestions = [];
    }

    return new Response(
      JSON.stringify({ 
        reply,
        suggestedQuestions
      }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
