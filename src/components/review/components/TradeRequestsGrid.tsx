
import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { createColumnDefs } from "./grid/columnDefs";
import { TradeRequest, RequestStatus } from "../types/trade-request.types";
import { GridCellStyles } from "./grid/GridCellStyles";
import { useTradeRows } from "./hooks/useTradeRows";
import { useRowActions } from "./grid/RowActions";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

interface TradeRequestsGridProps {
  rowData: TradeRequest[];
  showApproveButton: boolean;
  showRejectButton: boolean;
  onDataChange?: () => void;
  targetStatus?: RequestStatus;
}

export const TradeRequestsGrid = ({
  rowData,
  showApproveButton,
  showRejectButton,
  onDataChange,
  targetStatus,
}: TradeRequestsGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const { getRowId, isRowSelectable } = useTradeRows();
  const { handleApproveWithRowRemoval, handleRejectWithRowRemoval } = useRowActions({
    gridRef,
    rowData,
    onDataChange,
    targetStatus
  });

  const columnDefs = createColumnDefs(
    handleApproveWithRowRemoval,
    handleRejectWithRowRemoval,
    showApproveButton,
    showRejectButton
  );

  return (
    <div className="ag-theme-alpine h-full">
      <GridCellStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false,
        }}
        getRowId={getRowId}
        rowHeight={45}
        headerHeight={48}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        isRowSelectable={isRowSelectable}
        groupDefaultExpanded={1}
        groupDisplayType="groupRows"
        theme="legacy"
        context={{
          componentParent: this,
          'data-lov-id': '',
          'data-component-line': ''
        }}
      />
    </div>
  );
};
