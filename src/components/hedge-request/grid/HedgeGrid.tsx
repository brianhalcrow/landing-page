import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { gridStyles } from '../../configuration/grid/gridStyles';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  defaultColDef: any;
}

const HedgeGrid = ({ rowData, columnDefs, defaultColDef }: HedgeGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnState = columnDefs.map(def => ({
    colId: def.field,
    width: def.width,
  }));

  useEffect(() => {
    if (gridRef.current?.columnApi) {
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, []);

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="single"
        suppressRowClickSelection={false}
      />
    </div>
  );
};

export default HedgeGrid;