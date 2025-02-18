
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
      const rowNode = gridRef.current.api.getRowNode(request.request_no.toString());
      if (rowNode) {
        // If this is part of a group, remove all related trades
        if (request.hedge_group_id) {
          const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
          gridRef.current.api.applyTransaction({ remove: relatedRows });
        } else {
          gridRef.current.api.applyTransaction({ remove: [request] });
        }
      }
    }
  };

  const handleRejectWithRowRemoval = async (request: TradeRequest) => {
    await handleReject(request);
    if (gridRef.current?.api) {
      const rowNode = gridRef.current.api.getRowNode(request.request_no.toString());
      if (rowNode) {
        // If this is part of a group, remove all related trades
        if (request.hedge_group_id) {
          const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
          gridRef.current.api.applyTransaction({ remove: relatedRows });
        } else {
          gridRef.current.api.applyTransaction({ remove: [request] });
        }
      }
    }
  };

  const columnDefs = createColumnDefs(
    handleApproveWithRowRemoval,
    handleRejectWithRowRemoval,
    showApproveButton,
    showRejectButton
  );

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
        getRowId={(params) => params.data.request_no.toString()}
        rowHeight={45}
        headerHeight={48}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        groupDisplayType="groupRows"
      />
    </div>
  );
};
