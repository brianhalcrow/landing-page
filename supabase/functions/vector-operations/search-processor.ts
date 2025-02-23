
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

if (!openAIApiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

async function createEmbedding(input: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.trim(),
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

export async function processSearch(body: any, _openai: any, supabaseClient: any) {
  const { query, match_threshold = 0.7, match_count = 3 } = body;
  console.log('Processing search with query:', query);
  
  if (!query) {
    throw new Error('Search query is required');
  }

  try {
    console.log('Generating embedding for search query...');
    const embedding = await createEmbedding(query.slice(0, 1000)); // Limit query length
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
  } catch (error) {
    console.error('Search processing failed:', error);
    throw new Error(`Search processing failed: ${error.message}`);
  }
}
