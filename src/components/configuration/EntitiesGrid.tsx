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
      headerClass: 'ag-header-center'
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      minWidth: 180,
      flex: 2,
      sort: 'asc',
      sortIndex: 1,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'functional_currency', 
      headerName: 'Functional Currency', 
      minWidth: 75,
      flex: 1,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'accounting_rate_method', 
      headerName: 'Accounting Rate Method', 
      minWidth: 160,
      flex: 1.5,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      minWidth: 100,
      flex: 1,
      headerClass: 'ag-header-center',
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      minWidth: 160,
      flex: 1.5,
      headerClass: 'ag-header-center',
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
      headerClass: 'ag-header-center',
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
          .ag-header-center .ag-header-cell-label {
            justify-content: center;
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