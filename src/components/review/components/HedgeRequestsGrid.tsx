import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TradeRequest } from '../types/hedge-request.types';
import { Eye, CheckSquare, XSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeRequestsGridProps {
  rowData: TradeRequest[];
}

export const HedgeRequestsGrid = ({ rowData }: HedgeRequestsGridProps) => {
  const [selectedRequest, setSelectedRequest] = useState<TradeRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReview = (request: TradeRequest) => {
    setSelectedRequest(request);
    setIsReviewOpen(true);
  };

  const handleApprove = async (request: TradeRequest) => {
    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: 'Reviewed',
        reviewed_by: 'Current User', // TODO: Replace with actual user
        reviewed_at: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error('Failed to approve request');
      console.error('Error approving request:', error);
      return;
    }

    toast.success(`Request ${request.request_no} marked as reviewed`);
    setIsReviewOpen(false);
  };

  const handleReject = async (request: TradeRequest) => {
    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: 'Rejected',
        reviewed_by: 'Current User', // TODO: Replace with actual user
        reviewed_at: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error('Failed to reject request');
      console.error('Error rejecting request:', error);
      return;
    }

    toast.success(`Request ${request.request_no} rejected`);
    setIsReviewOpen(false);
  };

  const requestDetailColumns: ColDef<TradeRequest>[] = [
    { 
      field: 'request_no', 
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
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
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'strategy_name', 
      headerName: 'Strategy',
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'counterparty_name', 
      headerName: 'Counterparty',
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'ccy_pair', 
      headerName: 'Currency Pair',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'ccy_1_amount', 
      headerName: 'CCY1 Amount',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'ccy_2_amount', 
      headerName: 'CCY2 Amount',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'submitted_by', 
      headerName: 'Submitted By',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'submitted_at', 
      headerName: 'Submitted At',
      flex: 1,
      minWidth: 160,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    }
  ];

  const columnDefs: ColDef<TradeRequest>[] = [
    { 
      field: 'request_no', 
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
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
          Approved: 'bg-green-100 text-green-800'
        };
        return (
          <div className={`px-2 py-1 rounded-full text-sm font-medium text-center ${colorMap[status] || ''}`}>
            {status}
          </div>
        );
      }
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
    },
    { 
      field: 'strategy_name', 
      headerName: 'Strategy',
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
      headerName: 'Submitted',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
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
      headerName: 'Reviewed',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
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
      headerName: 'Approved',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center header-wrap',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    {
      headerName: 'Actions',
      minWidth: 150,
      headerClass: 'ag-header-center header-wrap',
      cellRenderer: (params: any) => {
        const request = params.data as TradeRequest;
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReview(request)}
              disabled={request.status !== 'Submitted'}
            >
              <Eye className="h-4 w-4 text-blue-500 hover:text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApprove(request)}
              disabled={request.status !== 'Reviewed'}
            >
              <CheckSquare className="h-4 w-4 text-green-500 hover:text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReject(request)}
              disabled={request.status === 'Approved'}
            >
              <XSquare className="h-4 w-4 text-red-500 hover:text-red-600" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <>
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

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Hedge Request #{selectedRequest?.request_no}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 min-h-0 ag-theme-alpine w-full">
              <AgGridReact
                rowData={selectedRequest ? [selectedRequest] : []}
                columnDefs={requestDetailColumns}
                defaultColDef={{
                  sortable: false,
                  filter: false,
                  resizable: true,
                }}
                domLayout="normal"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => setIsReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => selectedRequest && handleApprove(selectedRequest)}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Mark as Reviewed
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedRequest && handleReject(selectedRequest)}
              >
                <XSquare className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
