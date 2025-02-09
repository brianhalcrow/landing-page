
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { supabase } from "@/integrations/supabase/client";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Badge } from "@/components/ui/badge";

export function VectorSearch() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);

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
      field: 'metadata.fileName', 
      headerName: 'File Name',
      flex: 1,
      valueGetter: (params) => params.data.metadata?.fileName || 'N/A'
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
      valueFormatter: (params) => viewContent(params.value),
      wrapText: true,
      autoHeight: true,
      cellStyle: { 
        'white-space': 'normal',
        'line-height': '1.5',
        'padding': '10px'
      }
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

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    if (gridApi) {
      // Configure quick filter to search across all columns
      gridApi.setQuickFilter(searchText);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Document Search</h2>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search documents by content, filename, category..."
            onChange={handleSearch}
            className="w-full"
          />
          <div className="h-[600px] w-full ag-theme-alpine">
            <AgGridReact
              rowData={documents}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              animateRows={true}
              onGridReady={onGridReady}
              onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
              getRowHeight={() => 100}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
