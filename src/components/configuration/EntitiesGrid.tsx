
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef } from 'react';

interface EntitiesGridProps {
  entities: Tables<'entities'>[];
}

const EntitiesGrid = ({ entities }: EntitiesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: ColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      minWidth: 90,
      flex: 1,
      sort: 'asc',
      sortIndex: 0,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      minWidth: 180,
      flex: 2,
      sort: 'asc',
      sortIndex: 1,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'text-left pl-4'
    },
    { 
      field: 'functional_currency', 
      headerName: 'Functional Currency', 
      minWidth: 75,
      flex: 1,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    { 
      field: 'accounting_rate_method', 
      headerName: 'Accounting Rate Method', 
      minWidth: 160,
      flex: 1.5,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      minWidth: 100,
      flex: 1,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      minWidth: 160,
      flex: 1.5,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated At', 
      minWidth: 160,
      flex: 1.5,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      }
    }
  ];

  if (!entities.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>
        {`
          .ag-header-cell,
          .ag-header-group-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .ag-header-cell-label,
          .ag-header-group-cell-label {
            width: 100% !important;
            text-align: center !important;
          }
          .ag-header-cell-text {
            text-overflow: clip !important;
            overflow: visible !important;
            white-space: normal !important;
          }
          .ag-header-group-cell-with-group {
            border-bottom: 1px solid #babfc7 !important;
          }
          .custom-header {
            white-space: normal !important;
            line-height: 1.2 !important;
          }
          .custom-header .ag-header-cell-label {
            padding: 4px !important;
          }
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .text-left {
            justify-content: flex-start !important;
          }
          .ag-header-viewport {
            overflow: visible !important;
          }
          .ag-header-container {
            overflow: visible !important;
          }
        `}
      </style>
      <AgGridReact
        ref={gridRef}
        rowData={entities}
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

export default EntitiesGrid;
