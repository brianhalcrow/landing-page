
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { processFileContent } from './text-processor.ts';
import { chunkText } from './text-chunker.ts';
import { BATCH_SIZE } from './utils.ts';

export async function processStore(body: any, openai: OpenAIApi, supabaseClient: any) {
  const { file, metadata } = body;
  console.log('Processing store action for file:', file?.name);
  
  if (!file?.content) {
    throw new Error('File content is required');
  }

  console.log('Processing file content');
  const extractedText = await processFileContent(file.content, file.type);
  
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No text could be extracted from the file');
  }

  // Check for duplicate content
  const { data: existingDocs, error: searchError } = await supabaseClient
    .from('documents')
    .select('id, content')
    .eq('metadata->fileName', file.name);

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
  
  // Process chunks in batches
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
    
    const batchPromises = batch.map(async (chunk, batchIndex) => {
      const index = i + batchIndex;
      try {
        console.log(`Processing chunk ${index + 1}/${chunks.length}:`, chunk.slice(0, 100) + '...');
        
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: chunk.slice(0, 8000),
        });

        const [{ embedding }] = embeddingResponse.data.data;

        // Extract content type and generate tags
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const contentType = fileExtension === 'txt' ? 'text' : fileExtension;
        const generatedTags = [contentType, `chunk_${index + 1}`, metadata?.category || 'uncategorized'];

        if (metadata?.difficulty) {
          generatedTags.push(metadata.difficulty);
        }

        // Enhanced metadata structure
        const enhancedMetadata = {
          ...metadata,
          fileName: file.name,
          fileType: file.type,
          processingDate: new Date().toISOString(),
          chunkIndex: index + 1,
          totalChunks: chunks.length,
          contentType: contentType,
          status: 'completed'
        };

        console.log('Generated tags:', generatedTags);
        console.log('Enhanced metadata:', enhancedMetadata);

        return supabaseClient
          .from('documents')
          .insert({
            content: chunk,
            embedding,
            metadata: enhancedMetadata,
            metadata_tags: generatedTags,
            metadata_source_reference: file.name,
            metadata_category: metadata?.category || 'uncategorized',
            metadata_section: metadata?.section || 'general',
            metadata_difficulty: metadata?.difficulty || 'beginner'
          })
          .select();
      } catch (error) {
        console.error(`Error processing chunk ${index + 1}:`, error);
        throw error;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    processedChunks.push(...batchResults.map(result => result.data?.[0]));
    
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return {
    message: `Successfully processed ${processedChunks.length} chunks`,
    chunks: processedChunks
  };
}
