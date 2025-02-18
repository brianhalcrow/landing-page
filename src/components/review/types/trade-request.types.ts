
export type RequestStatus = 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected';

export interface TradeRequest {
  request_no: number;
  status: RequestStatus;
  entity_id: string;
  entity_name: string;
  strategy_name: string;
  strategy_id: string;
  instrument: string;
  trade_date: string | null;
  settlement_date: string;
  ccy_1: string;
  ccy_2: string;
  ccy_1_amount: number | null;
  ccy_2_amount: number | null;
  ccy_pair: string;
  cost_centre: string;
  counterparty_name: string;
  submitted_by: string;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  hedge_group_id: number | null;
}

export interface ActionButtonsProps {
  request: TradeRequest;
  onApprove: (request: TradeRequest) => Promise<void>;
  onReject: (request: TradeRequest) => Promise<void>;
  showApprove: boolean;
  showReject: boolean;
}
