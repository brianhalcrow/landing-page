
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { supabase } from "@/integrations/supabase/client";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Badge } from "@/components/ui/badge";

export function VectorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const getStatusBadge = (params: any) => {
    const status = params.data.metadata?.status || 'unknown';
    const hasEmbedding = params.data.embedding != null;
    
    if (hasEmbedding) {
      return <Badge className="bg-green-500">Vectorized</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (params: any) => {
    const category = params.data.metadata_category;
    switch (category) {
      case 'fx_training':
        return <Badge className="bg-blue-500">FX Training</Badge>;
      case 'fx_code':
        return <Badge className="bg-purple-500">FX Global Code</Badge>;
      case 'hedge_accounting':
        return <Badge className="bg-green-500">Hedge Accounting</Badge>;
      default:
        return <Badge className="bg-gray-500">Uncategorized</Badge>;
    }
  };

  const getDifficultyBadge = (params: any) => {
    const difficulty = params.data.metadata_difficulty;
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-400">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-400">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-400">Advanced</Badge>;
      default:
        return null;
    }
  };

  const viewContent = (content: string) => {
    const truncatedContent = content?.substring(0, 200) + (content?.length > 200 ? '...' : '');
    return truncatedContent || 'No content available';
  };

  const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { 
      field: 'metadata.filename', 
      headerName: 'File Name',
      flex: 1,
      valueGetter: (params) => params.data.metadata?.filename || 'N/A'
    },
    {
      field: 'metadata_category',
      headerName: 'Category',
      width: 150,
      cellRenderer: getCategoryBadge
    },
    {
      field: 'metadata_difficulty',
      headerName: 'Difficulty',
      width: 130,
      cellRenderer: getDifficultyBadge
    },
    {
      field: 'content',
      headerName: 'Content Preview',
      flex: 2,
      valueFormatter: (params) => viewContent(params.value)
    },
    {
      field: 'metadata.uploadedAt',
      headerName: 'Uploaded At',
      width: 200,
      valueGetter: (params) => {
        const date = params.data.metadata?.uploadedAt;
        return date ? new Date(date).toLocaleString() : 'N/A';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      cellRenderer: getStatusBadge
    }
  ];

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents...');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      console.log('Fetched documents:', data?.length || 0);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Set up real-time subscription
    const subscription = supabase
      .channel('documents_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents' }, 
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('vector-operations', {
        body: {
          action: 'search',
          query: searchQuery,
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

  const renderSearchResult = (result: any) => (
    <Card key={result.id} className="p-4 space-y-2">
      <div className="flex gap-2 items-center">
        {result.metadata_category && getCategoryBadge({ data: result })}
        {result.metadata_difficulty && getDifficultyBadge({ data: result })}
      </div>
      <p className="font-medium">{result.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Similarity: {(result.similarity * 100).toFixed(2)}%</span>
        {result.metadata_source_reference && (
          <span>Source: {result.metadata_source_reference.title}</span>
        )}
      </div>
      {result.metadata_tags && (
        <div className="flex gap-2 flex-wrap">
          {result.metadata_tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );

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

        {/* Results section */}
        <div className="space-y-2">
          {results.map(renderSearchResult)}
        </div>

        {/* Documents Grid */}
        <div className="h-[400px] w-full ag-theme-alpine mt-6">
          <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
          <AgGridReact
            rowData={documents}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            animateRows={true}
            onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </div>
    </Card>
  );
}
