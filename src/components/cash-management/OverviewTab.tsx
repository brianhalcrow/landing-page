
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';

interface CashManagementData {
  entity_id: string;
  entity_name: string;
  transaction_currency: string;
  month: string;
  category: string;
  "Transaction Amount": number;
  forecast_amount: number | null;
  source: string;
}

const mockData: CashManagementData[] = [
  {
    entity_id: "1",
    entity_name: "Entity A",
    transaction_currency: "USD",
    month: "2024-01-01",
    category: "Revenue",
    "Transaction Amount": 10000,
    forecast_amount: null,
    source: "Actual"
  },
  {
    entity_id: "1",
    entity_name: "Entity A",
    transaction_currency: "USD",
    month: "2024-01-01",
    category: "Revenue",
    "Transaction Amount": 0,
    forecast_amount: 12000,
    source: "Forecast"
  },
  {
    entity_id: "2",
    entity_name: "Entity B",
    transaction_currency: "EUR",
    month: "2024-01-01",
    category: "Expenses",
    "Transaction Amount": 5000,
    forecast_amount: null,
    source: "Actual"
  },
  {
    entity_id: "2",
    entity_name: "Entity B",
    transaction_currency: "EUR",
    month: "2024-01-01",
    category: "Expenses",
    "Transaction Amount": 0,
    forecast_amount: 5500,
    source: "Forecast"
  }
];

const OverviewTab = () => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridReady, setGridReady] = useState(false);

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
        field: 'Transaction Amount',
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
          rowData={mockData}
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
              console.log('Forecast amount changed:', event.data);
            }
          }}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
