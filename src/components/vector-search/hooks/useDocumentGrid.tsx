import { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { Badge } from "@/components/ui/badge";

export function useDocumentGrid() {
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
      minWidth: 200,
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

  return {
    columnDefs,
    gridApi,
    setGridApi,
    gridColumnApi,
    setGridColumnApi
  };
}
