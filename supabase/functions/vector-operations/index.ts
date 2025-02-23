
import { corsHeaders } from './cors-headers.ts'
import { storeDocument } from './store-processor.ts'
import { searchDocuments } from './search-processor.ts'

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
      console.log('Query:', query)
      
      try {
        const results = await searchDocuments(query)
        console.log(`Search completed. Found ${results.length} results`)
        
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
