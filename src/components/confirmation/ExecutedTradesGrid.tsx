
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeRegister } from './types';
import { format } from 'date-fns';
import { ColDef } from 'ag-grid-community';

const ExecutedTradesGrid = () => {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['executed-trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_register')
        .select('*')
        .order('trade_date', { ascending: false });
      
      if (error) throw error;
      return data as TradeRegister[];
    }
  });

  const columnDefs: ColDef<TradeRegister>[] = [
    { field: 'deal_no', headerName: 'Deal No', filter: true },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date', 
      filter: true,
      valueFormatter: (params: any) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy') : ''
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      filter: true,
      valueFormatter: (params: any) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy') : ''
    },
    { field: 'spot_rate', headerName: 'Spot Rate', filter: true },
    { field: 'ccy_2_amount', headerName: 'Quote Amount', filter: true },
    { field: 'ccy_1_amount', headerName: 'Base Amount', filter: true },
    { field: 'ccy_1', headerName: 'Base CCY', filter: true },
    { field: 'currency_pair', headerName: 'Currency Pair', filter: true },
    { field: 'ccy_2', headerName: 'Quote CCY', filter: true },
    { field: 'created_by', headerName: 'Created By', filter: true },
    { field: 'counterparty', headerName: 'Counterparty', filter: true },
    { field: 'entity_id', headerName: 'Entity ID', filter: true },
    { field: 'entity_name', headerName: 'Entity', filter: true },
    { field: 'strategy', headerName: 'Strategy', filter: true },
    { field: 'instrument', headerName: 'Instrument', filter: true },
    { field: 'contract_rate', headerName: 'Contract Rate', filter: true }
  ];

  if (isLoading) {
    return <div>Loading trades...</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] ag-theme-alpine">
      <AgGridReact
        rowData={trades}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          floatingFilter: true
        }}
        pagination={true}
        paginationPageSize={100}
      />
    </div>
  );
};

export default ExecutedTradesGrid;
