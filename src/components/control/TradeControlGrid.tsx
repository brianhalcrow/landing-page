
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface TradeRequest {
  request_no: number;
  entity_id: string;
  entity_name: string;
  strategy: string;
  ccy_pair: string;
  ccy_1: string;
  ccy_2: string;
  ccy_1_amount: number;
  ccy_2_amount: number;
  trade_date: string;
  settlement_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const TradeControlGrid = () => {
  const { toast } = useToast();

  const { data: tradeRequests, isLoading } = useQuery({
    queryKey: ['trade-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*');

      if (error) {
        console.error('Error fetching trade requests:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load trade requests"
        });
        throw error;
      }

      return data as TradeRequest[];
    }
  });

  const columnDefs: ColDef[] = [
    {
      field: 'request_no',
      headerName: 'Request No',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    {
      field: 'entity_id',
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      flex: 2,
      minWidth: 200,
      headerClass: 'ag-header-center'
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      flex: 1.5,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    {
      field: 'ccy_pair',
      headerName: 'Currency Pair',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    {
      field: 'ccy_1',
      headerName: 'Currency 1',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    {
      field: 'ccy_2',
      headerName: 'Currency 2',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    {
      field: 'ccy_1_amount',
      headerName: 'Amount 1',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? Number(params.value).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        }) : '';
      }
    },
    {
      field: 'ccy_2_amount',
      headerName: 'Amount 2',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? Number(params.value).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        }) : '';
      }
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      flex: 1.2,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      flex: 1.2,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1.5,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      flex: 1.5,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    }
  ];

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={tradeRequests}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          floatingFilter: true
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        pagination={true}
        paginationPageSize={100}
      />
    </div>
  );
};

export default TradeControlGrid;
