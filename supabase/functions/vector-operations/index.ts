
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'
import { processSearch } from './search-processor.ts'
import { storeDocument } from './store-processor.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!openAIApiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAIApi(new Configuration({ apiKey: openAIApiKey }))

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, file, metadata, query } = await req.json()
    console.log(`Processing ${action} request...`)

    if (action === 'store') {
      if (!file || !metadata) {
        throw new Error('Missing required file or metadata for storage operation')
      }

      console.log('Starting document storage process...')
      console.log('File info:', { name: file.name, type: file.type, size: file.size })
      
      try {
        const result = await storeDocument(file, metadata)
        console.log('Document stored successfully:', result)
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Document processed and stored successfully',
          data: result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch (storeError) {
        console.error('Error storing document:', storeError)
        throw new Error(`Failed to store document: ${storeError.message}`)
      }
    }

    if (action === 'search') {
      if (!query) {
        throw new Error('Missing required query parameter for search operation')
      }

      console.log('Starting document search process...')
      try {
        const results = await processSearch({ query }, openai, supabase)
        console.log(`Search completed. Found ${results?.length || 0} results`)
        
        return new Response(JSON.stringify({
          success: true,
          data: results
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch (searchError) {
        console.error('Error searching documents:', searchError)
        throw new Error(`Failed to search documents: ${searchError.message}`)
      }
    }

    throw new Error(`Unsupported action: ${action}`)

  } catch (error) {
    console.error('Operation failed:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred',
      details: error.stack || null
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
