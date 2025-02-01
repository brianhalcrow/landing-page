import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useEffect } from 'react';

interface EntitiesGridProps {
  entities: Tables<'entities'>[];
}

const EntitiesGrid = ({ entities }: EntitiesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: ColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      width: 110,
      sort: 'asc',
      sortIndex: 0
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      width: 200,
      sort: 'asc',
      sortIndex: 1
    },
    { 
      field: 'functional_currency', 
      headerName: 'Functional Currency', 
      width: 150 
    },
    { 
      field: 'accounting_rate_method', 
      headerName: 'Accounting Rate Method', 
      width: 180 
    },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      width: 100,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      width: 180,
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
      width: 180,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      }
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    // Load saved column state when component mounts
    const savedState = localStorage.getItem('entitiesGridColumnState');
    if (savedState && gridRef.current?.columnApi) {
      const columnState = JSON.parse(savedState);
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, []);

  const onColumnResized = () => {
    if (gridRef.current?.columnApi) {
      const columnState = gridRef.current.columnApi.getColumnState();
      localStorage.setItem('entitiesGridColumnState', JSON.stringify(columnState));
    }
  };

  if (!entities.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found.
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

export default EntitiesGrid;