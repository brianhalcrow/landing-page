
import { ColDef } from 'ag-grid-community';
import { TradeRequest } from '../../types/trade-request.types';
import { ActionButtons } from '../ActionButtons';
import { formatDate, formatDateNoTime } from '../utils/dateFormatter';

export const createColumnDefs = (
  handleApprove: (request: TradeRequest) => Promise<void>,
  handleReject: (request: TradeRequest) => Promise<void>,
  showApproveButton: boolean,
  showRejectButton: boolean,
): ColDef<TradeRequest>[] => [
  { 
    field: 'request_no', 
    headerName: 'Request #',
    flex: 0.5,
    minWidth: 100,
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
    field: 'entity_id', 
    headerName: 'Entity ID',
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
    field: 'counterparty_name', 
    headerName: 'Counterparty',
    flex: 1,
    minWidth: 150,
    headerClass: 'ag-header-center header-wrap',
  },
  { 
    field: 'buy_currency', 
    headerName: 'Buy Currency',
    field: 'ccy_1',
    flex: 0.7,
    minWidth: 100,
    headerClass: 'ag-header-center header-wrap',
  },
  { 
    field: 'buy_amount', 
    headerName: 'Buy Amount',
    field: 'ccy_1_amount',
    flex: 1,
    minWidth: 120,
    headerClass: 'ag-header-center header-wrap',
    type: 'numericColumn',
    valueFormatter: (params) => {
      if (params.value === null || params.value === undefined) return '';
      return params.value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  },
  { 
    field: 'sell_currency', 
    headerName: 'Sell Currency',
    field: 'ccy_2',
    flex: 0.7,
    minWidth: 100,
    headerClass: 'ag-header-center header-wrap',
  },
  { 
    field: 'sell_amount', 
    headerName: 'Sell Amount',
    field: 'ccy_2_amount',
    flex: 1,
    minWidth: 120,
    headerClass: 'ag-header-center header-wrap',
    type: 'numericColumn',
    valueFormatter: (params) => {
      if (params.value === null || params.value === undefined) return '';
      return params.value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
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
    valueFormatter: formatDateNoTime
  },
  { 
    field: 'cost_centre', 
    headerName: 'Cost Centre',
    flex: 1,
    minWidth: 120,
    headerClass: 'ag-header-center header-wrap',
  },
  { 
    field: 'ccy_pair', 
    headerName: 'CCY Pair',
    flex: 0.8,
    minWidth: 100,
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
