import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';
import InlineChatBot from '../InlineChatBot';

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
        .order('created_at', { ascending: false }) as { data: APILog[] | null; error: any };

      if (error) {
        console.error('Error fetching API logs:', error);
        throw error;
      }

      return data || [];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const columnDefs: ColDef[] = [
    { 
      field: 'created_at', 
      headerName: 'Timestamp',
      flex: 0.8,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : ''
    },
    { 
      field: 'endpoint', 
      headerName: 'Endpoint',
      flex: 0.7,
      minWidth: 130,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 0.4,
      minWidth: 90,
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
      flex: 0.5,
      minWidth: 110,
      headerClass: 'ag-header-center',
      type: 'numericColumn'
    },
    { 
      field: 'request_body', 
      headerName: 'Request',
      flex: 1.5,
      minWidth: 300,
      headerClass: 'ag-header-center',
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: 'normal', lineHeight: '1.5' },
      valueFormatter: (params) => 
        params.value ? JSON.stringify(params.value, null, 2) : ''
    },
    { 
      field: 'response', 
      headerName: 'Response',
      flex: 2,
      minWidth: 500,
      headerClass: 'ag-header-center',
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: 'normal', lineHeight: '1.5' },
      valueFormatter: (params) => 
        params.value ? JSON.stringify(params.value, null, 2) : ''
    }
  ];

  if (isLoading) {
    return <div className="p-4">Loading API logs...</div>;
  }

  return (
    <div className="flex flex-col space-y-8">
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
      
      <div className="w-full">
        <InlineChatBot />
      </div>
    </div>
  );
};

export default LLMLoggingTab;
