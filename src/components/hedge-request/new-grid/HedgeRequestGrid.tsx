
import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridApi } from "ag-grid-enterprise";
import { createColumnDefs } from "./config/columnDefs";
import { useHedgeRequestData } from "./hooks/useHedgeRequestData";
import { GridActions } from "./components/GridActions";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

const HedgeRequestGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { rowData, validConfigs, addNewRow, updateRowData, clearRowData } = useHedgeRequestData();

  const handleCellValueChanged = useCallback(
    (event: any) => {
      console.log('Cell value changed:', event);
      const { data, rowIndex, colDef, newValue } = event;
      if (colDef.field) {
        const updatedData = { ...data, [colDef.field]: newValue };
        updateRowData(rowIndex, updatedData);
      }

      // Force refresh of the grid
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.refreshCells({
          force: true,
          rowNodes: [event.node],
          columns: [event.column.getId()]
        });
      }
    },
    [updateRowData]
  );

  const getRowStyle = useCallback((params: any) => {
    if (params.data.isSaved) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        pointerEvents: "none",
      };
    }
    return {
      alignItems: "center",
      height: "45px",
    };
  }, []);

  const onGridReady = useCallback((params: { api: GridApi }) => {
    params.api.sizeColumnsToFit();
    setTimeout(() => {
      params.api.redrawRows();
    }, 100);
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: "600px" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createColumnDefs(gridRef.current?.api || null, {
          validConfigs,
          updateRowData,
        })}
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: true,
          suppressSizeToFit: false,
          flex: 1,
          minWidth: 150,
          suppressKeyboardEvent: (params) => {
            const { event } = params;
            return event.key === 'Tab';
          }
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
        stopEditingWhenCellsLoseFocus={false}
        onCellValueChanged={handleCellValueChanged}
        suppressMoveWhenRowDragging={true}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
        suppressHorizontalScroll={false}
        suppressScrollOnNewData={true}
      />
      <GridActions onAddRow={addNewRow} rowData={rowData} />
    </div>
  );
};

export default HedgeRequestGrid;
