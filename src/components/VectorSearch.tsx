
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function VectorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      // For demonstration, we're using a simple embedding (you should replace this with proper embedding generation)
      const mockEmbedding = Array(1536).fill(0).map(() => Math.random());
      
      const { data, error } = await supabase.functions.invoke('vector-operations', {
        body: {
          action: 'search',
          embedding: mockEmbedding,
          match_threshold: 0.8,
          match_count: 5
        }
      });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Search Documents</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="space-y-2">
          {results.map((result) => (
            <Card key={result.id} className="p-4">
              <p className="font-medium">{result.content}</p>
              <p className="text-sm text-gray-500">
                Similarity: {(result.similarity * 100).toFixed(2)}%
              </p>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
