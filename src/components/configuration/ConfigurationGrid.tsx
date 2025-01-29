import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useEffect } from 'react';

interface ConfigurationGridProps {
  entities: Tables<'pre_trade_sfx_config_exposures'>[];
}

const ConfigurationGrid = ({ entities }: ConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Entity Information',
      headerClass: 'text-center main-header wrap-header-text ag-header-group-text-center',
      children: [
        { field: 'entity_name', headerName: 'Entity Name', width: 150, headerClass: 'text-center wrap-header-text', cellClass: 'text-left' },
        { field: 'entity_id', headerName: 'Entity ID', width: 110, headerClass: 'text-center wrap-header-text', cellClass: 'text-center' },
        { field: 'functional_currency', headerName: 'FCCY', width: 100, headerClass: 'text-center wrap-header-text', cellClass: 'text-center' },
      ]
    },
    {
      headerName: 'Monetary Exposure',
      headerClass: 'text-center main-header wrap-header-text ag-header-group-text-center',
      children: [
        {
          headerName: 'Balance Sheet',
          headerClass: 'text-center wrap-header-text ag-header-group-text-center',
          children: [
            { field: 'monetary_assets', headerName: 'Monetary Assets', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'monetary_liabilities', headerName: 'Monetary Liabs', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'net_monetary', headerName: 'Net Monetary', width: 120, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
          ]
        }
      ]
    },
    {
      headerName: 'Cashflow Exposure',
      headerClass: 'text-center main-header wrap-header-text ag-header-group-text-center',
      children: [
        {
          headerName: 'Highly Probable Transactions',
          headerClass: 'text-center wrap-header-text ag-header-group-text-center',
          children: [
            { field: 'revenue', headerName: 'Revenue', width: 100, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'costs', headerName: 'Costs', width: 100, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'net_income', headerName: 'Net Income', width: 110, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
          ]
        },
        {
          headerName: 'Firm Commitments',
          headerClass: 'text-center wrap-header-text ag-header-group-text-center',
          children: [
            { field: 'po', headerName: 'Purchase Orders', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'ap', headerName: 'Accounts Payable', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'ar', headerName: 'Accounts Receivable', width: 140, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'other', headerName: 'Other', width: 100, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
          ]
        },
      ]
    },
    {
      headerName: 'Settlement Exposure',
      headerClass: 'text-center main-header wrap-header-text ag-header-group-text-center',
      children: [
        {
          headerName: 'Intramonth',
          headerClass: 'text-center wrap-header-text ag-header-group-text-center',
          children: [
            { field: 'ap_realized', headerName: 'Accounts Payable', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'ar_realized', headerName: 'Accounts Receivable', width: 140, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
            { field: 'fx_realized', headerName: 'FX Conversions', width: 130, headerClass: 'text-center wrap-header-text', cellClass: 'ag-checkbox-center' },
          ]
        }
      ]
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    const savedState = localStorage.getItem('configurationGridColumnState');
    if (savedState && gridRef.current?.columnApi) {
      const columnState = JSON.parse(savedState);
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, []);

  const onColumnResized = () => {
    if (gridRef.current?.columnApi) {
      const columnState = gridRef.current.columnApi.getColumnState();
      localStorage.setItem('configurationGridColumnState', JSON.stringify(columnState));
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
      <style>
        {`
          .ag-header-cell-text {
            width: 100%;
            text-align: center;
          }
          .wrap-header-text .ag-header-cell-text {
            white-space: normal !important;
            line-height: 1.2;
          }
          .text-center {
            text-align: center;
          }
          .text-left {
            text-align: left;
          }
          .ag-header-group-cell-label {
            justify-content: center;
          }
          .main-header {
            font-weight: 600;
            background-color: #f8f9fa;
          }
          .ag-header-group-text-center {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
          }
          .ag-checkbox-center {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
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

export default ConfigurationGrid;