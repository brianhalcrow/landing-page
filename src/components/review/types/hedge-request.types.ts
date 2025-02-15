
export interface TradeRequest {
  request_no: number;
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
  created_by: string;
  created_at: string;
  updated_at: string;
  swap_reference?: string | null;
}
