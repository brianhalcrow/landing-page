
import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridApi } from "ag-grid-enterprise";
import { createColumnDefs } from "./config/columnDefs";
import { useHedgeRequestData } from "./hooks/useHedgeRequestData";
import { GridActions } from "./components/GridActions";

const HedgeRequestGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { rowData, validConfigs, addNewRow, updateRowData, clearRowData, removeRow } = useHedgeRequestData();

  const handleCellValueChanged = useCallback(
    (event: any) => {
      const { data, rowIndex, colDef, newValue } = event;
      if (colDef.field && newValue !== data[colDef.field]) {
        const updatedData = { ...data, [colDef.field]: newValue };
        updateRowData(rowIndex, updatedData);

        // Only refresh the specific cell that changed
        if (gridRef.current?.api) {
          gridRef.current.api.refreshCells({
            force: true,
            rowNodes: [event.node],
            columns: [event.column.getId()]
          });
        }
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
    <div className="ag-theme-alpine h-[600px] w-full">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createColumnDefs(gridRef.current?.api || null, {
          validConfigs,
          updateRowData,
          onRemoveRow: removeRow
        })}
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: true,
          suppressSizeToFit: false,
          flex: 1,
          minWidth: 150
        }}
        getRowId={(params) => params.data.rowId}
        rowHeight={45}
        headerHeight={48}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        stopEditingWhenCellsLoseFocus={false}
        onCellValueChanged={handleCellValueChanged}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
        suppressHorizontalScroll={false}
        suppressScrollOnNewData={true}
        rowSelection="multiple"
        theme="legacy"
        context={{
          componentParent: this,
          // Place any Lovable dev properties here
          'data-lov-id': '',
          'data-component-line': ''
        }}
      />
      <GridActions onAddRow={addNewRow} rowData={rowData} />
    </div>
  );
};

export default HedgeRequestGrid;
