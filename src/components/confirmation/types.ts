
export interface TradeRegister {
  deal_no: number;
  trade_date: string;
  settlement_date: string;
  entity_id: string;
  entity_name: string;
  ccy_1: string;
  ccy_2: string;
  ccy_1_amount: number;
  ccy_2_amount: number;
  currency_pair: string;
  spot_rate: number;
  contract_rate: number;
  counterparty: string;
  strategy: string;
  instrument: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
