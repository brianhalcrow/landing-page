
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';

interface APILog {
  id: number;
  endpoint: string;
  request_body: any;
  response: any;
  status: string;
  created_at: string;
  duration_ms: number;
}

const LLMLoggingTab = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['api-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API logs:', error);
        throw error;
      }

      return data as APILog[];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const columnDefs: ColDef[] = [
    { 
      field: 'created_at', 
      headerName: 'Timestamp',
      flex: 1,
      minWidth: 180,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : ''
    },
    { 
      field: 'endpoint', 
      headerName: 'Endpoint',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 0.5,
      minWidth: 100,
      headerClass: 'ag-header-center',
      cellStyle: (params) => {
        if (params.value === 'success') return { color: '#16a34a' };
        if (params.value === 'error') return { color: '#dc2626' };
        return {};
      }
    },
    { 
      field: 'duration_ms', 
      headerName: 'Duration (ms)',
      flex: 0.7,
      minWidth: 120,
      headerClass: 'ag-header-center',
      type: 'numericColumn'
    },
    { 
      field: 'request_body', 
      headerName: 'Request',
      flex: 2,
      minWidth: 300,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? JSON.stringify(params.value, null, 2) : ''
    },
    { 
      field: 'response', 
      headerName: 'Response',
      flex: 2,
      minWidth: 300,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? JSON.stringify(params.value, null, 2) : ''
    }
  ];

  if (isLoading) {
    return <div className="p-4">Loading API logs...</div>;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={logs}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default LLMLoggingTab;
