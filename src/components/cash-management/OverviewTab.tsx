
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

interface CashManagementData {
  entity_id: string;
  entity_name: string;
  currency: string;
  month: string;
  actual_amount: number;
  ap_forecast_amount: number;
  ar_forecast_amount: number;
  trade_forecast_amount: number;
  total_amount: number;
  sources: string;
}

const OverviewTab = () => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridReady, setGridReady] = useState(false);
  
  const { data: rowData, isLoading } = useQuery({
    queryKey: ['cash-management-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_cash_management')
        .select('*')
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }

      return data as CashManagementData[];
    }
  });

  const columnDefs = useMemo(() => {
    const fixedColumns: ColDef[] = [
      { 
        field: 'entity_name',
        headerName: 'Entity',
        pinned: 'left',
        width: 180,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      },
      { 
        field: 'currency',
        headerName: 'Currency',
        pinned: 'left',
        width: 100,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      }
    ];

    // Get unique months from the data
    const months = rowData ? [...new Set(rowData.map(row => format(new Date(row.month), 'yyyy-MM')))] : [];
    months.sort(); // Sort months chronologically

    const monthColumns = months.map(month => ({
      headerName: month,
      children: [
        {
          field: `actual_${month}`,
          headerName: 'Actual',
          width: 120,
          valueGetter: (params: any) => {
            const rowMonth = params.data.month ? format(new Date(params.data.month), 'yyyy-MM') : '';
            return rowMonth === month ? params.data.actual_amount : null;
          },
          valueFormatter: (params: ValueFormatterParams) => {
            if (params.value != null) {
              return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
              }).format(params.value);
            }
            return '';
          },
          headerClass: 'ag-header-center',
          cellClass: 'cell-right'
        },
        {
          field: `forecast_${month}`,
          headerName: 'Forecast',
          width: 120,
          valueGetter: (params: any) => {
            const rowMonth = params.data.month ? format(new Date(params.data.month), 'yyyy-MM') : '';
            return rowMonth === month ? (
              params.data.ap_forecast_amount +
              params.data.ar_forecast_amount +
              params.data.trade_forecast_amount
            ) : null;
          },
          valueFormatter: (params: ValueFormatterParams) => {
            if (params.value != null) {
              return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
              }).format(params.value);
            }
            return '';
          },
          headerClass: 'ag-header-center',
          cellClass: 'cell-right'
        },
        {
          field: `total_${month}`,
          headerName: 'Total',
          width: 120,
          valueGetter: (params: any) => {
            const rowMonth = params.data.month ? format(new Date(params.data.month), 'yyyy-MM') : '';
            return rowMonth === month ? params.data.total_amount : null;
          },
          valueFormatter: (params: ValueFormatterParams) => {
            if (params.value != null) {
              return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
              }).format(params.value);
            }
            return '';
          },
          headerClass: 'ag-header-center',
          cellClass: 'cell-right'
        }
      ]
    }));

    return [...fixedColumns, ...monthColumns];
  }, [rowData]);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridReady(true);
    
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 200);
  };

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
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          onGridReady={onGridReady}
          domLayout="normal"
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
