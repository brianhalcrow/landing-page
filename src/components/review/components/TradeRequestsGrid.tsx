
import { AgGridReact } from 'ag-grid-react';
import { TradeRequest, RequestStatus } from '../types/trade-request.types';
import { createColumnDefs } from './grid/columnDefs';
import { useTradeRequestActions } from './hooks/useTradeRequestActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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
  targetStatus 
}: TradeRequestsGridProps) => {
  const { handleApprove, handleReject } = useTradeRequestActions(onDataChange);

  const columnDefs = createColumnDefs(
    (request) => handleApprove(request, targetStatus),
    handleReject,
    showApproveButton,
    showRejectButton
  );

  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={{
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: false
      }}
      animateRows={true}
      suppressColumnVirtualisation={true}
      enableCellTextSelection={true}
    />
  );
};
