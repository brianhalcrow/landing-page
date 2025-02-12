import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeRegister } from './types';
import { format } from 'date-fns';
import { ColDef, GridApi } from 'ag-grid-community';
import { useEffect, useRef, useState } from 'react';
import { useGridPreferences } from '../cash-management/hooks/useGridPreferences';

const ExecutedTradesGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [api, setApi] = useState<GridApi | null>(null);
  const { saveColumnState, loadColumnState } = useGridPreferences(gridRef, 'executed-trades-grid');

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

  const formatAmount = (params: any) => {
    if (params.value === null || params.value === undefined) return '';
    const value = params.value;
    const formattedValue = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return value < 0 ? `-${formattedValue}` : formattedValue;
  };

  const amountCellStyle = (params: any) => {
    if (params.value < 0) {
      return { color: 'red' };
    }
    return null;
  };

  const columnDefs: ColDef<TradeRegister>[] = [
    { 
      field: 'deal_no', 
      headerName: 'Deal No', 
      filter: true,
      width: 120,
      suppressSizeToFit: true
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date', 
      filter: true,
      width: 130,
      suppressSizeToFit: true,
      valueFormatter: (params: any) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy') : ''
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      filter: true,
      width: 130,
      suppressSizeToFit: true,
      valueFormatter: (params: any) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy') : ''
    },
    { 
      field: 'spot_rate', 
      headerName: 'Spot Rate', 
      filter: true,
      width: 120,
      suppressSizeToFit: true
    },
    { 
      field: 'ccy_2_amount', 
      headerName: 'Quote Amount', 
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      valueFormatter: formatAmount,
      cellStyle: amountCellStyle
    },
    { 
      field: 'ccy_1_amount', 
      headerName: 'Base Amount', 
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      valueFormatter: formatAmount,
      cellStyle: amountCellStyle
    },
    { 
      field: 'ccy_1', 
      headerName: 'Base CCY', 
      filter: true,
      width: 100,
      suppressSizeToFit: true
    },
    { 
      field: 'currency_pair', 
      headerName: 'Currency Pair', 
      filter: true,
      width: 120,
      suppressSizeToFit: true
    },
    { 
      field: 'ccy_2', 
      headerName: 'Quote CCY', 
      filter: true,
      width: 100,
      suppressSizeToFit: true
    },
    { 
      field: 'created_by', 
      headerName: 'Created By', 
      filter: true,
      width: 130,
      suppressSizeToFit: true
    },
    { 
      field: 'counterparty', 
      headerName: 'Counterparty', 
      filter: true,
      width: 150,
      suppressSizeToFit: true
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      filter: true,
      width: 120,
      suppressSizeToFit: true
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity', 
      filter: true,
      width: 200,
      suppressSizeToFit: true
    },
    { 
      field: 'strategy', 
      headerName: 'Strategy', 
      filter: true,
      width: 130,
      suppressSizeToFit: true
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument', 
      filter: true,
      width: 130,
      suppressSizeToFit: true
    },
    { 
      field: 'contract_rate', 
      headerName: 'Contract Rate', 
      filter: true,
      width: 120,
      suppressSizeToFit: true
    }
  ];

  const onGridReady = async (params: any) => {
    setApi(params.api);
    await loadColumnState();
  };

  const onColumnMoved = () => {
    if (api) {
      saveColumnState();
    }
  };

  const onColumnResized = () => {
    if (api) {
      saveColumnState();
    }
  };

  if (isLoading) {
    return <div>Loading trades...</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
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
        onGridReady={onGridReady}
        onColumnMoved={onColumnMoved}
        onColumnResized={onColumnResized}
      />
    </div>
  );
};

export default ExecutedTradesGrid;
