import { AgGridReact } from "ag-grid-react";
import { createColumnDefs } from "./config/columnDefs";
import { useHedgeRequestData } from "./hooks/useHedgeRequestData";
import { GridActions } from "./components/GridActions";
import { useCallback, useRef } from "react";
import { GridApi } from "ag-grid-enterprise";

const HedgeRequestGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { rowData, validConfigs, addNewRow, updateRowData, clearRowData } =
    useHedgeRequestData();

  const handleCellValueChanged = useCallback(
    (event: any) => {
      const { rowIndex, colDef, newValue } = event;
      if (colDef.field) {
        updateRowData(rowIndex, { [colDef.field]: newValue });
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
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ width: "100%", height: "auto" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createColumnDefs(gridRef.current?.api || null, {
          validConfigs,
          updateRowData,
        })}
        defaultColDef={{
          sortable: false, // Disable sorting
          filter: false, // Disable filtering
          resizable: true,
          suppressSizeToFit: false,
          flex: 1,
          autoHeight: false,
          wrapText: false,
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
      />
    </div>
  );
};

export default HedgeRequestGrid;
