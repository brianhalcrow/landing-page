import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getColumnDefs } from './grid/columnDefinitions';
import { gridStyles } from './grid/gridStyles';
import EmptyGridMessage from './grid/EmptyGridMessage';
import { Entity } from './types';

interface ConfigurationGridProps {
  entities: Entity[];
}

const ConfigurationGrid = ({ entities }: ConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    suppressSizeToFit: true,
  };

  const columnState = [
    { colId: 'entity_name', width: 250 },
    { colId: 'entity_id', width: 110 },
    { colId: 'functional_currency', width: 120 },
    { colId: 'accounting_rate_method', width: 150 },
  ];

  useEffect(() => {
    if (gridRef.current?.columnApi) {
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, [entities]);

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
      />
    </div>
  );
};

export default ConfigurationGrid;