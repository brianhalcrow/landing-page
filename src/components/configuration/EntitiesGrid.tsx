import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColumnState } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useEffect } from 'react';

interface EntitiesGridProps {
  entities: Tables<'pre_trade_sfx_config_entity'>[];
}

const EntitiesGrid = ({ entities }: EntitiesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: ColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 110 },
    { field: 'entity_name', headerName: 'Entity Name', width: 150 },
    { field: 'functional_currency', headerName: 'Functional Currency', width: 120 },
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