
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { processFileContent } from './text-processor.ts';
import { chunkText } from './text-chunker.ts';
import { BATCH_SIZE } from './utils.ts';
import { StoreRequestBody, FileMetadata } from './types.ts';

export async function processStore(body: StoreRequestBody, openai: OpenAIApi, supabaseClient: any) {
  const { file, metadata } = body;
  console.log('Processing store action for file:', file?.name);
  console.log('Initial metadata:', JSON.stringify(metadata, null, 2));
  
  if (!file?.content) {
    throw new Error('File content is required');
  }

  console.log('Processing file content');
  const { text: extractedText, metadata: analyzedMetadata } = await processFileContent(file.content, file.type);
  
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No text could be extracted from the file');
  }

  // Merge analyzed metadata with existing metadata, preferring analyzed values
  const enhancedMetadata: FileMetadata = {
    ...metadata,
    ...analyzedMetadata,
    fileName: file.name,
    fileType: file.type,
    size: file.size || file.content.length,
    uploadedAt: new Date().toISOString(),
    status: 'completed'
  };

  console.log('Enhanced metadata:', JSON.stringify(enhancedMetadata, null, 2));

  // Use parameterized query for duplicate check
  const { data: existingDocs, error: searchError } = await supabaseClient
    .from('documents')
    .select('id, content')
    .eq('metadata->>fileName', file.name);

  if (searchError) {
    console.error('Error checking for duplicates:', searchError);
    throw searchError;
  }

  if (existingDocs && existingDocs.length > 0) {
    console.log(`Document ${file.name} already exists. Skipping processing.`);
    return {
      message: 'Document already exists',
      existingDocuments: existingDocs
    };
  }

  console.log('Text extracted, length:', extractedText.length);
  
  const chunks = chunkText(extractedText);
  console.log(`Split content into ${chunks.length} chunks`);

  const processedChunks = [];
  
  // Process chunks in batches with enhanced error handling
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
    
    const batchPromises = batch.map(async (chunk, batchIndex) => {
      const index = i + batchIndex;
      try {
        console.log(`Processing chunk ${index + 1}/${chunks.length}`);
        
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: chunk.slice(0, 8000),
        });

        const [{ embedding }] = embeddingResponse.data.data;

        // Generate consistent tags using enhanced metadata
        const generatedTags = [
          enhancedMetadata.category,
          `chunk_${index + 1}`,
          enhancedMetadata.difficulty
        ];

        // Insert with explicit JSONB casting and enhanced metadata
        const { data, error } = await supabaseClient
          .from('documents')
          .insert({
            content: chunk,
            embedding,
            metadata: enhancedMetadata,
            metadata_tags: generatedTags,
            metadata_source_reference: file.name,
            metadata_category: enhancedMetadata.category,
            metadata_section: enhancedMetadata.section,
            metadata_difficulty: enhancedMetadata.difficulty
          })
          .select();

        if (error) {
          throw error;
        }

        return data?.[0];
      } catch (error) {
        console.error(`Error processing chunk ${index + 1}:`, error);
        throw error;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    processedChunks.push(...batchResults.filter(Boolean));
    
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return {
    message: `Successfully processed ${processedChunks.length} chunks`,
    chunks: processedChunks
  };
}
