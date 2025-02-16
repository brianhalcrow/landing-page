
import { AgGridReact } from 'ag-grid-react';
import { createColumnDefs } from './config/columnDefs';
import { useHedgeRequestData } from './hooks/useHedgeRequestData';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useCallback, useRef } from 'react';
import { GridApi } from 'ag-grid-community';

const HedgeRequestGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const {
    rowData,
    validConfigs,
    addNewRow,
    updateRowData,
    clearRowData
  } = useHedgeRequestData();

  const handleCellValueChanged = useCallback((event: any) => {
    const { rowIndex, colDef, newValue } = event;
    if (colDef.field) {
      updateRowData(rowIndex, { [colDef.field]: newValue });
    }
  }, [updateRowData]);

  const getRowStyle = useCallback((params: any) => {
    if (params.data.isSaved) {
      return { 
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        pointerEvents: 'none'
      };
    }
    return {};
  }, []);

  const onGridReady = useCallback((params: { api: GridApi }) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="space-y-4">
      <div className="w-full ag-theme-alpine border border-gray-200">
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
            flex: 1,
            headerClass: 'ag-header-cell-value-wrapper',
            cellClass: 'ag-cell-value-wrapper'
          }}
          getRowId={(params) => {
            if (params.data?.id) {
              return params.data.id.toString();
            }
            return `generated-${Date.now()}-${Math.random()}`;
          }}
          rowHeight={45}
          headerHeight={48}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={handleCellValueChanged}
          suppressMoveWhenRowDragging={true}
          getRowStyle={getRowStyle}
          onGridReady={onGridReady}
          domLayout="autoHeight"
          suppressHorizontalScroll={true}
          suppressScrollOnNewData={true}
          rowClass="ag-row-value-wrapper"
          suppressPropertyNamesCheck={true}
        />
      </div>

      <GridActions 
        onAddRow={addNewRow}
        rowData={rowData}
        onClearGrid={clearRowData}
      />
    </div>
  );
};

export default HedgeRequestGrid;
