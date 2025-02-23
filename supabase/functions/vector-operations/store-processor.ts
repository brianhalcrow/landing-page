
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode } from 'https://deno.land/std@0.177.0/encoding/base64.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'
import { chunkDocument } from './text-chunker.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAIApi(new Configuration({ apiKey: openAIApiKey }))

export async function storeDocument(file: any, metadata: any) {
  console.log('Starting document storage process...')
  
  try {
    // Decode base64 content
    const decodedContent = decode(file.content)
    console.log('Content decoded successfully, length:', decodedContent.length)

    // Chunk the document
    const chunks = chunkDocument(decodedContent)
    console.log(`Document chunked into ${chunks.length} parts`)

    const storedChunks = []
    
    for (const [index, chunk] of chunks.entries()) {
      console.log(`Processing chunk ${index + 1}/${chunks.length}`)
      
      try {
        // Generate embeddings
        const embeddingResponse = await openai.createEmbedding({
          model: 'text-embedding-ada-002',
          input: chunk
        })
        
        const [{ embedding }] = embeddingResponse.data.data
        console.log(`Generated embedding for chunk ${index + 1}`)

        // Store in database
        const { data: storedDoc, error: storeError } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            metadata: {
              ...metadata,
              chunk_index: index,
              total_chunks: chunks.length
            },
            embedding
          })
          .select()
          .single()

        if (storeError) {
          throw new Error(`Database storage failed: ${storeError.message}`)
        }

        storedChunks.push(storedDoc)
        console.log(`Stored chunk ${index + 1} successfully`)

      } catch (chunkError) {
        console.error(`Error processing chunk ${index + 1}:`, chunkError)
        throw new Error(`Failed to process chunk ${index + 1}: ${chunkError.message}`)
      }
    }

    return {
      chunks_processed: storedChunks.length,
      total_chunks: chunks.length,
      document_id: storedChunks[0]?.id
    }

  } catch (error) {
    console.error('Document storage failed:', error)
    throw new Error(`Document storage failed: ${error.message}`)
  }
}

function decode(base64Content: string): string {
  try {
    const binary = atob(base64Content)
    return binary
  } catch (error) {
    console.error('Error decoding content:', error)
    throw new Error('Failed to decode document content')
  }
}
