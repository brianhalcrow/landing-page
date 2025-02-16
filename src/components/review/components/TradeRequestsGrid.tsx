
import { AgGridReact } from 'ag-grid-react';
import { createColumnDefs } from './grid/columnDefs';
import { TradeRequest, RequestStatus } from '../types/trade-request.types';
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
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        rowHeight={45}
        headerHeight={48}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};
