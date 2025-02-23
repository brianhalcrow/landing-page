
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'
import { chunkDocument } from './text-chunker.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!openAIApiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAIApi(new Configuration({ apiKey: openAIApiKey }))

export async function storeDocument(file: any, metadata: any) {
  console.log('Starting document storage process...')
  
  try {
    // Decode base64 content
    const content = decodeBase64Content(file.content)
    console.log('Content decoded successfully, length:', content.length)

    // Split content into chunks
    console.log('Chunking document...')
    const chunks = chunkDocument(content)
    console.log(`Document split into ${chunks.length} chunks`)

    const storedChunks = []
    
    for (const [index, chunk] of chunks.entries()) {
      console.log(`Processing chunk ${index + 1}/${chunks.length}`)
      
      try {
        // Generate embedding for chunk
        console.log(`Generating embedding for chunk ${index + 1}...`)
        const embeddingResponse = await openai.createEmbedding({
          model: 'text-embedding-ada-002',
          input: chunk.trim()
        })

        if (!embeddingResponse.data.data[0].embedding) {
          throw new Error('Failed to generate embedding')
        }

        const embedding = embeddingResponse.data.data[0].embedding
        console.log(`Generated embedding for chunk ${index + 1}, vector length:`, embedding.length)

        // Store chunk with embedding
        const { data: storedChunk, error: insertError } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            metadata: {
              ...metadata,
              chunk_index: index,
              total_chunks: chunks.length,
              processed_at: new Date().toISOString()
            },
            embedding
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(`Failed to store chunk in database: ${insertError.message}`)
        }

        storedChunks.push(storedChunk)
        console.log(`Successfully stored chunk ${index + 1}/${chunks.length}`)

      } catch (chunkError) {
        console.error(`Error processing chunk ${index + 1}:`, chunkError)
        throw new Error(`Failed to process chunk ${index + 1}: ${chunkError.message}`)
      }
    }

    console.log('Document processing completed successfully')
    return {
      success: true,
      chunks_processed: storedChunks.length,
      total_chunks: chunks.length,
      first_chunk_id: storedChunks[0]?.id
    }

  } catch (error) {
    console.error('Document storage failed:', error)
    throw new Error(`Document storage failed: ${error.message}`)
  }
}

function decodeBase64Content(base64Content: string): string {
  try {
    return atob(base64Content)
  } catch (error) {
    console.error('Error decoding content:', error)
    throw new Error('Failed to decode document content')
  }
}
