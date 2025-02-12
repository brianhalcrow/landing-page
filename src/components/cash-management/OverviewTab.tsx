
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

interface CashManagementData {
  entity_id: string;
  entity_name: string;
  transaction_currency: string;
  month: string;
  category: string;
  actual_amount: number;
  forecast_amount: number | null;
  source: string;
}

const OverviewTab = () => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridReady, setGridReady] = useState(false);
  
  const { data: rowData, isLoading } = useQuery({
    queryKey: ['cash-management-data'],
    queryFn: async () => {
      // First get actual data
      const { data: actualData, error: actualError } = await supabase
        .from('v_cash_management')
        .select('*')
        .order('month', { ascending: true });

      if (actualError) {
        console.error('Error fetching actual data:', actualError);
        throw actualError;
      }

      // Then get forecast data
      const { data: forecastData, error: forecastError } = await supabase
        .from('cash_management_forecast')
        .select('*')
        .order('month', { ascending: true });

      if (forecastError) {
        console.error('Error fetching forecast data:', forecastError);
        throw forecastError;
      }

      // Process actual data
      const actual = actualData.map(row => ({
        entity_id: row.entity_id,
        entity_name: row.entity_name,
        transaction_currency: row.transaction_currency,
        month: row.month,
        category: row.category,
        actual_amount: row.actual_amount || 0,
        forecast_amount: null,
        source: 'Actual'
      }));

      // Process forecast data
      const forecast = forecastData.map(row => ({
        entity_id: row.entity_id,
        entity_name: row.entity_name,
        transaction_currency: row.transaction_currency,
        month: row.month,
        category: row.category,
        actual_amount: 0,
        forecast_amount: row.forecast_amount,
        source: 'Forecast'
      }));

      return [...actual, ...forecast];
    }
  });

  const columnDefs = useMemo(() => {
    const baseColumns: ColDef[] = [
      { 
        field: 'entity_name',
        headerName: 'Entity',
        pinned: 'left',
        width: 180,
        rowGroup: true,
        hide: true
      },
      { 
        field: 'transaction_currency',
        headerName: 'Currency',
        width: 100
      },
      {
        field: 'category',
        headerName: 'Category',
        width: 120
      },
      {
        field: 'month',
        headerName: 'Month',
        width: 120,
        valueFormatter: (params) => {
          return params.value ? format(new Date(params.value), 'MMM yyyy') : '';
        }
      },
      {
        field: 'actual_amount',
        headerName: 'Actual',
        width: 120,
        type: 'numericColumn',
        valueFormatter: (params) => {
          if (params.value != null) {
            return new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(params.value);
          }
          return '';
        }
      },
      {
        field: 'forecast_amount',
        headerName: 'Forecast',
        width: 120,
        editable: true,
        cellClass: 'editable-cell',
        type: 'numericColumn',
        valueFormatter: (params) => {
          if (params.value != null) {
            return new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(params.value);
          }
          return '';
        }
      }
    ];

    return baseColumns;
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: false
  }), []);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridReady(true);
    
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 200);
  };

  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Entity',
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true
    }
  }), []);

  useEffect(() => {
    if (!gridApi || !gridReady) return;

    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [gridApi, gridReady]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div 
        className="flex-grow ag-theme-alpine"
        style={{ 
          height: 'calc(100vh - 12rem)',
          minHeight: '500px',
          width: '100%'
        }}
      >
        <GridStyles />
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
          domLayout="normal"
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={(event) => {
            if (event.colDef.field === 'forecast_amount') {
              // Here we would add logic to save the forecast amount
              console.log('Forecast amount changed:', event.data);
            }
          }}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
