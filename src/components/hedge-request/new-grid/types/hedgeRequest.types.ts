
export interface HedgeRequestRow {
  entity_id: string;
  entity_name: string;
  strategy: string;
  instrument: string;
  counterparty: string;
  counterparty_name: string;
  // Trade details
  buy_sell: 'BUY' | 'SELL';
  amount: number;
  currency: string;
  trade_date: string;
  settlement_date: string;
  cost_centre?: string;
}

export interface ValidHedgeConfig {
  entity_id: string;
  entity_name: string;
  strategy: string;
  strategy_description: string;
  instrument: string;
  counterparty_id: string;
  counterparty_name: string;
}
