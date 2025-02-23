
import { SupabaseClient } from '@supabase/supabase-js';
import { corsHeaders } from '../vector-operations/cors-headers';
import { TextChunker } from './text-chunker';
import { generateEmbedding } from './text-processor';

interface FileMetadata {
  fileName: string;
  fileType: string;
  size: number;
  chunk_index?: number;
  total_chunks?: number;
  category?: string;
  section?: string;
  difficulty?: string;
  [key: string]: any;
}

export async function storeDocument(
  supabase: SupabaseClient,
  content: string,
  metadata: FileMetadata
) {
  console.log('Starting document storage process...');
  const chunks = await TextChunker.chunk(content);
  console.log(`Split content into ${chunks.length} chunks`);

  const results = [];
  const retries = 3;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    metadata.chunk_index = i + 1;
    metadata.total_chunks = chunks.length;
    
    let attempt = 1;
    while (attempt <= retries) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}, attempt ${attempt}/${retries}`);
      
      try {
        console.log('Generating embedding for chunk...');
        const embedding = await generateEmbedding(chunk);
        console.log('Embedding generated successfully');

        // Remove any id from metadata if present
        const { id, ...cleanMetadata } = metadata;
        
        // Create a unique identifier for this chunk
        const chunkIdentifier = `${metadata.fileName}_${metadata.chunk_index}`;
        
        // Simple insert without conflict handling
        const { data: storedChunk, error: insertError } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            metadata: {
              ...cleanMetadata,
              chunk_index: metadata.chunk_index,
              total_chunks: metadata.total_chunks,
              chunk_identifier: chunkIdentifier,
              processed_at: new Date().toISOString()
            },
            embedding
          })
          .select()
          .maybeSingle();

        if (insertError) {
          console.error(`Insert attempt ${attempt} failed:`, insertError);
          if (attempt === retries) {
            throw new Error(`Failed to store chunk in database: ${insertError.message}`);
          }
          attempt++;
          continue;
        }

        if (!storedChunk) {
          console.warn(`No data returned for chunk ${metadata.chunk_index}, attempting retry...`);
          if (attempt === retries) {
            throw new Error('No chunk data returned after insert');
          }
          attempt++;
          continue;
        }

        console.log(`Successfully stored chunk ${metadata.chunk_index} with id ${storedChunk.id}`);
        results.push(storedChunk);
        break; // Success, exit retry loop
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          throw new Error(`Failed to process chunk ${i + 1}: ${error.message}`);
        }
        attempt++;
      }
    }
  }

  return results;
}
