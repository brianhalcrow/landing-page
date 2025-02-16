
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TradeRequest, RequestStatus } from '../types/trade-request.types';
import { ActionButtons } from './ActionButtons';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

  const handleApprove = async (request: TradeRequest) => {
    const newStatus: RequestStatus = targetStatus || 'Reviewed';
    const updateField = newStatus === 'Reviewed' ? 'reviewed' : 'approved';

    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: newStatus,
        [`${updateField}_by`]: 'Current User', // TODO: Replace with actual user
        [`${updateField}_at`]: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error(`Failed to update request: ${error.message}`);
      return;
    }

    toast.success(`Request ${request.request_no} ${updateField}`);
    onDataChange?.();
  };

  const handleReject = async (request: TradeRequest) => {
    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: 'Rejected' as RequestStatus,
        rejected_by: 'Current User', // TODO: Replace with actual user
        rejected_at: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error(`Failed to reject request: ${error.message}`);
      return;
    }

    toast.success(`Request ${request.request_no} rejected`);
    onDataChange?.();
  };

  const formatDate = (params: any) => {
    return params.value ? new Date(params.value).toLocaleString() : '';
  };

  const columnDefs: ColDef<TradeRequest>[] = [
    { 
      field: 'request_no', 
      headerName: 'Request #',
      flex: 0.5,
      minWidth: 100,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
      cellRenderer: (params: any) => {
        const status = params.value;
        const colorMap: Record<string, string> = {
          Submitted: 'bg-blue-100 text-blue-800',
          Reviewed: 'bg-yellow-100 text-yellow-800',
          Approved: 'bg-green-100 text-green-800',
          Rejected: 'bg-red-100 text-red-800'
        };
        return (
          <div className={`px-2 py-1 rounded-full text-sm font-medium text-center ${colorMap[status] || ''}`}>
            {status}
          </div>
        );
      }
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'strategy_id', 
      headerName: 'Strategy ID',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'strategy_name', 
      headerName: 'Strategy Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date',
      flex: 1,
      minWidth: 130,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      flex: 1,
      minWidth: 130,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'ccy_1', 
      headerName: 'CCY 1',
      flex: 0.7,
      minWidth: 100,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'ccy_2', 
      headerName: 'CCY 2',
      flex: 0.7,
      minWidth: 100,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'ccy_1_amount', 
      headerName: 'CCY 1 Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
      type: 'numericColumn',
    },
    { 
      field: 'ccy_2_amount', 
      headerName: 'CCY 2 Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
      type: 'numericColumn',
    },
    { 
      field: 'ccy_pair', 
      headerName: 'CCY Pair',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'cost_centre', 
      headerName: 'Cost Centre',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'counterparty_name', 
      headerName: 'Counterparty',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'submitted_by', 
      headerName: 'Submitted By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'submitted_at', 
      headerName: 'Submitted At',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'reviewed_by', 
      headerName: 'Reviewed By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'reviewed_at', 
      headerName: 'Reviewed At',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'approved_by', 
      headerName: 'Approved By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'approved_at', 
      headerName: 'Approved At',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'rejected_by', 
      headerName: 'Rejected By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'rejected_at', 
      headerName: 'Rejected At',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: formatDate
    },
    { 
      field: 'rejection_reason', 
      headerName: 'Rejection Reason',
      flex: 1.5,
      minWidth: 200,
      headerClass: 'ag-header-center header-wrap',
    },
    {
      headerName: 'Actions',
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
      cellRenderer: (params: any) => {
        const request = params.data as TradeRequest;
        return (
          <ActionButtons
            request={request}
            onApprove={handleApprove}
            onReject={handleReject}
            showApprove={showApproveButton}
            showReject={showRejectButton}
          />
        );
      }
    }
  ];

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
