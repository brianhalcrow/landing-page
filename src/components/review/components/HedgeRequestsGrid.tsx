import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../../hedge-request/grid/components/GridStyles";
import { HedgeRequestOverview } from '../types/hedge-request.types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeRequestsGridProps {
  rowData: HedgeRequestOverview[];
}

export const HedgeRequestsGrid = ({ rowData }: HedgeRequestsGridProps) => {
  const columnDefs: ColDef<HedgeRequestOverview>[] = [
    { 
      field: 'id', 
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'cost_centre', 
      headerName: 'Cost Centre',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'functional_currency', 
      headerName: 'Currency',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l1', 
      headerName: 'Category L1',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l2', 
      headerName: 'Category L2',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l3', 
      headerName: 'Category L3',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'strategy_description', 
      headerName: 'Strategy',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'created_by', 
      headerName: 'Created By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'created_at', 
      headerName: 'Created',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'trade_id', 
      headerName: 'Trade ID',
      flex: 0.5,
      minWidth: 80,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'buy_currency', 
      headerName: 'Buy Currency',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'sell_currency', 
      headerName: 'Sell Currency',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'buy_amount', 
      headerName: 'Buy Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString() : '';
      }
    },
    { 
      field: 'sell_amount', 
      headerName: 'Sell Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString() : '';
      }
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    }
  ];

  return (
    <div className="ag-theme-alpine h-[600px] w-full">
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
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};