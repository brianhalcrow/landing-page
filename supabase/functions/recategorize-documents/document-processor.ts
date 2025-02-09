
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Document, ProcessingResult } from './types.ts';
import { OpenAIService } from './openai-service.ts';

export class DocumentProcessor {
  private supabase: any;
  private openAIService: OpenAIService;

  constructor(supabaseUrl: string, supabaseKey: string, openAIKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.openAIService = new OpenAIService(openAIKey);
  }

  async processEmptyDocument(doc: Document): Promise<ProcessingResult> {
    console.log(`Document ${doc.id} has no content, marking as uncategorized`);
    
    const metadata = {
      ...(doc.metadata || {}),
      category: 'uncategorized',
      section: 'general',
      difficulty: 'beginner',
      recategorized_at: new Date().toISOString(),
      retry_count: 1
    };

    await this.updateDocument(doc.id, metadata);

    return {
      id: doc.id,
      success: true,
      analysis: { category: 'uncategorized', section: 'general', difficulty: 'beginner' },
      progressMessage: `Marked empty document ${doc.id} as uncategorized`
    };
  }

  async processDocument(doc: Document, batchNumber: number, totalBatches: number): Promise<ProcessingResult> {
    try {
      console.log(`Processing document ${doc.id}`);
      
      if (!doc.content || doc.content.trim().length === 0) {
        return await this.processEmptyDocument(doc);
      }

      const analysis = await this.openAIService.analyzeDocument(doc.content);
      
      const metadata = {
        ...(doc.metadata || {}),
        category: analysis.category,
        section: analysis.section,
        difficulty: analysis.difficulty,
        recategorized_at: new Date().toISOString(),
        retry_count: 1
      };

      await this.updateDocument(doc.id, metadata);

      const progressMessage = `Processed document ${doc.id} (Batch ${batchNumber}/${totalBatches})`;
      console.log(progressMessage);
      
      return {
        id: doc.id,
        success: true,
        analysis,
        progressMessage
      };

    } catch (error) {
      console.error(`Error processing document ${doc.id}:`, error);
      return {
        id: doc.id,
        success: false,
        error: error.message,
        progressMessage: `Failed to process document ${doc.id}`
      };
    }
  }

  private async updateDocument(docId: number, metadata: any) {
    const { error: updateError } = await this.supabase
      .from('documents')
      .update({
        metadata,
        metadata_category: metadata.category,
        metadata_section: metadata.section,
        metadata_difficulty: metadata.difficulty
      })
      .eq('id', docId);

    if (updateError) {
      throw updateError;
    }
  }

  async fetchDocuments() {
    console.log('Fetching documents that need recategorization...');

    const { data: documents, error: fetchError } = await this.supabase
      .from('documents')
      .select('id, content, metadata')
      .or(
        'metadata_category.is.null,' +
        'metadata_section.is.null,' +
        'metadata_difficulty.is.null'
      )
      .is('metadata->retry_count', null)
      .order('id')
      .limit(200);

    if (fetchError) {
      throw fetchError;
    }

    return documents;
  }
}
