
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { chunkText } from './text-chunker.ts';
import { processFileContent } from './text-processor.ts';

const BATCH_SIZE = 5;

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  category?: string;
  section?: string;
  difficulty?: string;
  [key: string]: any;
}

export interface FileData {
  name: string;
  type: string;
  content: string;
  size?: number;
}

export class DocumentProcessor {
  private openai: OpenAIApi;
  private supabaseClient: any;

  constructor(openaiApiKey: string, supabaseUrl: string, supabaseServiceKey: string) {
    const configuration = new Configuration({ apiKey: openaiApiKey });
    this.openai = new OpenAIApi(configuration);
    
    this.supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
  }

  private async checkForDuplicates(fileName: string): Promise<any[]> {
    const { data: existingDocs, error: searchError } = await this.supabaseClient
      .from('documents')
      .select('id, content')
      .eq('metadata->fileName', fileName);

    if (searchError) {
      console.error('Error checking for duplicates:', searchError);
      throw searchError;
    }

    return existingDocs || [];
  }

  private generateMetadataTags(fileName: string, chunkIndex: number): string[] {
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const contentType = fileExtension === 'txt' ? 'text' : fileExtension;
    return [contentType, `chunk_${chunkIndex + 1}`];
  }

  private async processChunk(chunk: string, index: number, totalChunks: number, file: FileData, metadata: DocumentMetadata) {
    try {
      console.log(`Processing chunk ${index + 1}/${totalChunks}:`, chunk.slice(0, 100) + '...');
      
      const embeddingResponse = await this.openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: chunk.slice(0, 8000),
      });

      const [{ embedding }] = embeddingResponse.data.data;
      
      const generatedTags = this.generateMetadataTags(file.name, index);
      
      const enhancedMetadata = {
        ...metadata,
        chunk: index + 1,
        totalChunks,
        chunkSize: chunk.length,
        fileName: file.name,
        fileType: file.type,
        processingDate: new Date().toISOString(),
        status: 'completed'
      };

      return this.supabaseClient
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
        .select()
        .single();
    } catch (error) {
      console.error(`Error processing chunk ${index + 1}:`, error);
      throw error;
    }
  }

  public async processDocument(file: FileData, metadata: DocumentMetadata) {
    console.log('Processing file:', file?.name);
    
    if (!file?.content) {
      throw new Error('File content is required');
    }

    const existingDocs = await this.checkForDuplicates(file.name);
    if (existingDocs.length > 0) {
      console.log(`Document ${file.name} already exists. Skipping processing.`);
      return { message: 'Document already exists', existingDocuments: existingDocs };
    }

    const extractedText = await processFileContent(file.content, file.type);
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the file');
    }

    console.log('Text extracted, length:', extractedText.length);
    
    const chunks = chunkText(extractedText);
    console.log(`Split content into ${chunks.length} chunks`);

    const processedChunks = [];
    
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
      
      const batchPromises = batch.map((chunk, batchIndex) => 
        this.processChunk(chunk, i + batchIndex, chunks.length, file, metadata)
      );

      const batchResults = await Promise.all(batchPromises);
      processedChunks.push(...batchResults.map(result => result.data));
      
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return {
      message: `Successfully processed ${processedChunks.length} chunks`,
      chunks: processedChunks
    };
  }
}
