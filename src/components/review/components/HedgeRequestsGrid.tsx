import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TradeRequest } from '../types/hedge-request.types';
import { Eye, CheckSquare, XSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeRequestsGridProps {
  rowData: TradeRequest[];
}

export const HedgeRequestsGrid = ({ rowData }: HedgeRequestsGridProps) => {
  const handleReview = (request: TradeRequest) => {
    toast.info(`Reviewing request ${request.request_no}`);
  };

  const handleApprove = (request: TradeRequest) => {
    toast.info(`Approving request ${request.request_no}`);
  };

  const handleReject = (request: TradeRequest) => {
    toast.info(`Rejecting request ${request.request_no}`);
  };

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
