import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useEffect } from 'react';

interface EntitiesGridProps {
  entities: Tables<'entities'>[];
}

const EntitiesGrid = ({ entities }: EntitiesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const baseColumnDefs: (ColDef | ColGroupDef)[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      minWidth: 90,
      flex: 1,
      sort: 'asc',
      sortIndex: 0
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      minWidth: 180,
      flex: 2,
      sort: 'asc',
      sortIndex: 1
    },
    { 
      field: 'functional_currency', 
      headerName: 'Functional Currency', 
      minWidth: 75,
      flex: 1
    },
    { 
      field: 'accounting_rate_method', 
      headerName: 'Accounting Rate Method', 
      minWidth: 160,
      flex: 1.5
    },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      minWidth: 100,
      flex: 1,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      minWidth: 160,
      flex: 1.5,
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
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      }
    },
  ];

  const createExposureColumns = (exposureTypes: any[]): ColGroupDef[] => {
    // Group exposures by L1 and L2 categories
    const groupedExposures = exposureTypes.reduce((acc: any, type) => {
      const l1 = type.exposure_category_l1;
      const l2 = type.exposure_category_l2;
      
      if (!acc[l1]) acc[l1] = {};
      if (!acc[l1][l2]) acc[l1][l2] = [];
      
      acc[l1][l2].push(type);
      return acc;
    }, {});

    // Create hierarchical column structure
    return Object.entries(groupedExposures).map(([l1, l2Group]: [string, any]) => ({
      headerName: l1,
      groupId: l1,
      children: Object.entries(l2Group).map(([l2, types]: [string, any]) => ({
        headerName: l2,
        groupId: `${l1}-${l2}`,
        children: types.map((type: any) => ({
          headerName: type.exposure_category_l3,
          field: `exposure_${type.exposure_type_id}`,
          minWidth: 120,
          flex: 1,
          cellRenderer: 'checkboxRenderer',
          cellRendererParams: {
            disabled: false
          }
        }))
      }))
    }));
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
        columnDefs={baseColumnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        onColumnResized={onColumnResized}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default EntitiesGrid;