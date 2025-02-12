
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
  transaction_currency: string;
  month: string;
  category: string;
  actual_amount: number;
  transaction_amount: number;
  source: string;
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

      // Add opening balance rows
      const processedData = [];
      const entityCurrencyGroups = new Set(data.map(row => 
        `${row.entity_name}-${row.transaction_currency}`
      ));

      entityCurrencyGroups.forEach(group => {
        const [entityName, currency] = group.split('-');
        processedData.push({
          entity_name: entityName,
          transaction_currency: currency,
          category: 'Opening Balance',
          month: data[0].month, // Use the earliest month
          actual_amount: 0, // You might want to calculate this from your data
          transaction_amount: 0,
          source: 'Opening Balance'
        });
      });

      return [...processedData, ...data];
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
        cellClass: 'cell-left',
        rowGroup: true
      },
      { 
        field: 'transaction_currency',
        headerName: 'Currency',
        pinned: 'left',
        width: 100,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left',
        rowGroup: true
      },
      {
        field: 'category',
        headerName: 'Category',
        pinned: 'left',
        width: 120,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      }
    ];

    // Get unique months from the data
    const months = rowData ? [...new Set(rowData.map(row => 
      format(new Date(row.month), 'yyyy-MM')
    ))].sort() : [];

    const monthColumns = months.map(month => ({
      field: `amount_${month}`,
      headerName: month,
      width: 120,
      valueGetter: (params: any) => {
        const rowMonth = params.data.month ? format(new Date(params.data.month), 'yyyy-MM') : '';
        return rowMonth === month ? params.data.transaction_amount : null;
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(params.value);
        }
        return '';
      },
      headerClass: 'ag-header-center',
      cellClass: 'cell-right'
    }));

    return [...fixedColumns, ...monthColumns];
  }, [rowData]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: false
  }), []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Entity/Currency',
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true
    }
  }), []);

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
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          suppressAggFuncInHeader={true}
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
