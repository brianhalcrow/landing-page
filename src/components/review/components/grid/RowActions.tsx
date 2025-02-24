
import { useRef } from 'react';
import { AgGridReact } from "ag-grid-react";
import { TradeRequest, RequestStatus } from "../../types/trade-request.types";
import { useTradeRequestActions } from "../hooks/useTradeRequestActions";

interface RowActionsProps {
  gridRef: React.RefObject<AgGridReact>;
  rowData: TradeRequest[];
  onDataChange?: () => void;
  targetStatus?: RequestStatus;
}

export const useRowActions = ({ gridRef, rowData, onDataChange, targetStatus }: RowActionsProps) => {
  const { handleApprove, handleReject } = useTradeRequestActions(onDataChange);

  const handleApproveWithRowRemoval = async (request: TradeRequest) => {
    await handleApprove(request, targetStatus);
    if (gridRef.current?.api) {
      if (request.instrument?.toLowerCase() === 'swap' && request.hedge_group_id) {
        const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
        gridRef.current.api.applyTransaction({ remove: relatedRows });
      } else {
        gridRef.current.api.applyTransaction({ remove: [request] });
      }
    }
  };

  const handleRejectWithRowRemoval = async (request: TradeRequest) => {
    await handleReject(request);
    if (gridRef.current?.api) {
      if (request.instrument?.toLowerCase() === 'swap' && request.hedge_group_id) {
        const relatedRows = rowData.filter(row => row.hedge_group_id === request.hedge_group_id);
        gridRef.current.api.applyTransaction({ remove: relatedRows });
      } else {
        gridRef.current.api.applyTransaction({ remove: [request] });
      }
    }
  };

  return {
    handleApproveWithRowRemoval,
    handleRejectWithRowRemoval
  };
};
