
import { AgGridReact } from 'ag-grid-react';
import { createColumnDefs } from './config/columnDefs';
import { useHedgeRequestData } from './hooks/useHedgeRequestData';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useCallback, useRef } from 'react';

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

  // Calculate exact height based on number of rows (45px per row) plus header (48px)
  const gridHeight = (rowData?.length || 0) * 45 + 48;

  return (
    <div className="space-y-4">
      <div className={`w-full ag-theme-alpine border border-gray-200`} style={{ height: `${gridHeight}px`, overflow: 'hidden' }}>
        <style>
          {`
            .ag-cell {
              display: flex !important;
              align-items: center !important;
            }
            .ag-header-cell-label {
              display: flex !important;
              align-items: center !important;
              justify-content: left !important;
            }
            .ag-cell select {
              width: 100% !important;
              padding-right: 24px !important;
            }
            .ag-cell .relative svg {
              right: 8px !important;
            }
            .ag-cell-wrapper {
              width: 100% !important;
            }
            .ag-root-wrapper {
              border: none !important;
            }
            .ag-root {
              overflow: hidden !important;
            }
          `}
        </style>
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
            suppressSizeToFit: false
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
          suppressHorizontalScroll={true}
          suppressScrollOnNewData={true}
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
