
import { AgGridReact } from 'ag-grid-react';
import { createColumnDefs } from './config/columnDefs';
import { useHedgeRequestData } from './hooks/useHedgeRequestData';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { useCallback, useRef } from 'react';

const HedgeRequestGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const {
    rowData,
    validConfigs,
    addNewRow,
    updateRowData
  } = useHedgeRequestData();

  const handleCellValueChanged = useCallback((event: any) => {
    const { rowIndex, colDef, newValue } = event;
    if (colDef.field) {
      updateRowData(rowIndex, { [colDef.field]: newValue });
    }
  }, [updateRowData]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={createColumnDefs(gridRef.current?.api || null, { 
            validConfigs,
            updateRowData 
          })}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false,
            floatingFilter: true
          }}
          suppressRowClickSelection={true}
          enableRangeSelection={true}
          enableFillHandle={true}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          stopEditingWhenCellsLoseFocus={true}
          getRowId={(params) => {
            if (params.data?.id) {
              return params.data.id.toString();
            }
            return `generated-${Date.now()}-${Math.random()}`;
          }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={handleCellValueChanged}
          suppressMoveWhenRowDragging={true}
        />
      </div>

      <GridActions 
        onAddRow={addNewRow}
        rowData={rowData}
      />
    </div>
  );
};

export default HedgeRequestGrid;
