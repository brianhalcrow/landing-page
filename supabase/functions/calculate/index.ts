
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const { category, inputs } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get calculation template
    const { data: template, error: templateError } = await supabase
      .from('calculation_templates')
      .select('*')
      .eq('category', category)
      .single()

    if (templateError) throw templateError
    if (!template) throw new Error('Calculation template not found')

    // Validate inputs against template
    const requiredInputs = Object.keys(template.formula_template.inputs)
    for (const input of requiredInputs) {
      if (!(input in inputs)) {
        throw new Error(`Missing required input: ${input}`)
      }
    }

    // Perform calculation
    // Note: In a production environment, you'd want to use a safer way to evaluate expressions
    const result = eval(template.formula_template.calculation.replace(
      /\b\w+\b/g,
      (match) => inputs[match] || match
    ))

    // Format output using template
    const formattedOutput = {
      summary: {
        title: template.output_format.summary.title,
        base_amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: inputs.base_currency
        }).format(inputs.amount),
        quote_amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: inputs.quote_currency
        }).format(result),
        settlement_date: new Date(Date.now() + (inputs.days_to_settlement * 24 * 60 * 60 * 1000)).toLocaleDateString(),
        notes: template.output_format.summary.notes
      }
    }

    return new Response(
      JSON.stringify(formattedOutput),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
