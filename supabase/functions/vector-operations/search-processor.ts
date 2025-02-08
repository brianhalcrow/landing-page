
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export class SearchProcessor {
  private openai: OpenAIApi;
  private supabaseClient: any;

  constructor(openaiApiKey: string, supabaseUrl: string, supabaseServiceKey: string) {
    const configuration = new Configuration({ apiKey: openaiApiKey });
    this.openai = new OpenAIApi(configuration);
    
    this.supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
  }

  public async search(query: string, matchThreshold: number = 0.7, matchCount: number = 3) {
    console.log('Processing search with query:', query);
    
    if (!query) {
      throw new Error('Search query is required');
    }

    const embedTimeout = 10000;
    const embedPromise = this.openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query.slice(0, 1000),
    });

    const embeddingResponse = await Promise.race([
      embedPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Embedding request timeout')), embedTimeout)
      )
    ]);

    const [{ embedding }] = embeddingResponse.data.data;
    console.log('Generated embedding for search query');

    const { data: searchData, error: searchError } = await this.supabaseClient
      .rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: Math.min(matchCount, 5)
      });

    if (searchError) {
      console.error('Error searching documents:', searchError);
      throw searchError;
    }
    
    console.log('Found', searchData?.length || 0, 'matching documents');
    return searchData;
  }
}
