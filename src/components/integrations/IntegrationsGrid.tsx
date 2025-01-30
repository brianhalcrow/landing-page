import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useEffect } from 'react';

interface IntegrationsGridProps {
  entities: Tables<'pre_trade_sfx_config_exposures'>[];
}

const IntegrationsGrid = ({ entities }: IntegrationsGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Entity Details',
      children: [
        { field: 'entity_id', headerName: 'Entity ID', width: 110 },
        { field: 'entity_name', headerName: 'Entity Name', width: 150 },
        { field: 'functional_currency', headerName: 'Functional Currency', width: 120 },
      ]
    },
    {
      headerName: 'Cashflow Exposure',
      children: [
        { field: 'po', headerName: 'Purchase Orders', width: 130 },
        { field: 'ap', headerName: 'Accounts Payable', width: 130 },
        { field: 'ar', headerName: 'Sales Orders', width: 130 },
        { field: 'other', headerName: 'Other', width: 100 },
      ]
    },
    {
      headerName: 'Settlement Exposure',
      children: [
        { field: 'revenue', headerName: 'Revenue', width: 100 },
        { field: 'costs', headerName: 'Costs', width: 100 },
        { field: 'net_income', headerName: 'Net Revenue/Costs', width: 140 },
        { field: 'ap_realized', headerName: 'AP', width: 100 },
        { field: 'ar_realized', headerName: 'AR', width: 100 },
        { field: 'fx_realized', headerName: 'FX Deals', width: 100 },
      ]
    },
    {
      headerName: 'Monetary Exposure',
      children: [
        { field: 'monetary_assets', headerName: 'Monetary Assets', width: 130 },
        { field: 'monetary_liabilities', headerName: 'Monetary Liabilities', width: 140 },
        { field: 'net_monetary', headerName: 'Net Monetary', width: 120 },
      ]
    },
    {
      headerName: 'Metadata',
      children: [
        { 
          field: 'created_at', 
          headerName: 'Created At', 
          width: 160,
          valueFormatter: (params) => {
            if (params.value) {
              return new Date(params.value).toLocaleString();
            }
            return '';
          }
        },
      ]
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    // Load saved column state when component mounts
    const savedState = localStorage.getItem('integrationsGridColumnState');
    if (savedState && gridRef.current?.columnApi) {
      const columnState = JSON.parse(savedState);
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, []);

  const onColumnResized = () => {
    if (gridRef.current?.columnApi) {
      const columnState = gridRef.current.columnApi.getColumnState();
      localStorage.setItem('integrationsGridColumnState', JSON.stringify(columnState));
    }
  };

  if (!entities.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found. Please configure entities in the Configuration tab.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        rowData={entities}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        onColumnResized={onColumnResized}
      />
    </div>
  );
};

export default IntegrationsGrid;