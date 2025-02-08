
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

export async function processSearch(body: any, openai: OpenAIApi, supabaseClient: any) {
  const { query, match_threshold = 0.7, match_count = 3 } = body;
  console.log('Processing search with query:', query);
  
  if (!query) {
    throw new Error('Search query is required');
  }

  // Set a timeout for the embedding request
  const embedTimeout = 10000; // 10 seconds
  const embedPromise = openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query.slice(0, 1000), // Limit query length
  });

  const embeddingResponse = await Promise.race([
    embedPromise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Embedding request timeout')), embedTimeout)
    )
  ]);

  const [{ embedding }] = embeddingResponse.data.data;
  
  console.log('Generated embedding for search query');

  // Add limits to the RPC call
  const { data: searchData, error: searchError } = await supabaseClient
    .rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: match_threshold,
      match_count: Math.min(match_count, 5) // Never return more than 5 matches
    });

  if (searchError) {
    console.error('Error searching documents:', searchError);
    throw searchError;
  }
  
  console.log('Found', searchData?.length || 0, 'matching documents');
  
  return searchData;
}
