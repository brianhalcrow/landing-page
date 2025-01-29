import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getColumnDefs } from './grid/columnDefinitions';
import { gridStyles } from './grid/gridStyles';
import EmptyGridMessage from './grid/EmptyGridMessage';

interface ConfigurationGridProps {
  entities: Tables<'pre_trade_sfx_config_exposures'>[];
}

const ConfigurationGrid = ({ entities }: ConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

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
    return <EmptyGridMessage />;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={entities}
        columnDefs={getColumnDefs()}
        defaultColDef={defaultColDef}
        animateRows={true}
        onColumnResized={onColumnResized}
      />
    </div>
  );
};

export default ConfigurationGrid;