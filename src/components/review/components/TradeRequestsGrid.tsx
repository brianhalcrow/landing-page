
import { AgGridReact } from "ag-grid-react";
import { createColumnDefs } from "./grid/columnDefs";
import { TradeRequest, RequestStatus } from "../types/trade-request.types";
import { useTradeRequestActions } from "./hooks/useTradeRequestActions";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import { useRef } from "react";

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
  const { handleApprove, handleReject } = useTradeRequestActions(onDataChange);

  const handleApproveWithRowRemoval = async (request: TradeRequest) => {
    await handleApprove(request, targetStatus);
    if (gridRef.current?.api) {
      if (request.instrument?.toLowerCase() === 'swap' && request.hedge_group_id) {
        // For swaps, remove all trades with the same hedge_group_id
        const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
        gridRef.current.api.applyTransaction({ remove: relatedRows });
      } else {
        // For non-swaps, just remove the individual row
        gridRef.current.api.applyTransaction({ remove: [request] });
      }
    }
  };

  const handleRejectWithRowRemoval = async (request: TradeRequest) => {
    await handleReject(request);
    if (gridRef.current?.api) {
      if (request.instrument?.toLowerCase() === 'swap' && request.hedge_group_id) {
        // For swaps, remove all trades with the same hedge_group_id
        const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
        gridRef.current.api.applyTransaction({ remove: relatedRows });
      } else {
        // For non-swaps, just remove the individual row
        gridRef.current.api.applyTransaction({ remove: [request] });
      }
    }
  };

  const columnDefs = createColumnDefs(
    handleApproveWithRowRemoval,
    handleRejectWithRowRemoval,
    showApproveButton,
    showRejectButton
  );

  // Group rows by hedge_group_id for swaps
  const getRowId = (params: { data: TradeRequest }) => 
    params.data.request_no.toString();

  const isRowSelectable = (params: { data: TradeRequest }) => {
    if (params.data.instrument?.toLowerCase() === 'swap') {
      // For swaps, only allow selection of the first leg
      return params.data.swap_leg === 1;
    }
    return true;
  };

  return (
    <div className="ag-theme-alpine h-full">
      <style>
        {`
          .ag-cell {
            display: flex !important;
            align-items: center !important;
          }
          .ag-cell-wrapper {
            width: 100%;
          }
        `}
      </style>
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
      />
    </div>
  );
};
