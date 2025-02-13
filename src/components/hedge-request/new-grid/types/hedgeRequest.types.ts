
export interface HedgeRequest {
  entity_id: string;
  entity_name: string;
  counterparty: string;
  strategy: string;
  instrument: string;
  ccy_pair: string;
  trade_date: string;
  settlement_date: string;
  created_at?: string;
  updated_at?: string;
}
