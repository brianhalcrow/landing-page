
export interface ValidHedgeConfig {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  strategy_id: number;
  strategy_name: string;
  strategy_description: string;
  instrument: string;
  counterparty_id: string;
  counterparty_name: string;
  cost_centre?: string; // Adding as optional since it might not always be present
}

export interface HedgeRequestRow {
  entity_id: string;
  entity_name: string;
  strategy_name: string;
  instrument: string;
  counterparty_name: string;
  buy_currency: string;
  buy_amount: number | null;
  sell_currency: string;
  sell_amount: number | null;
  trade_date: string | null;
  settlement_date: string | null;
  cost_centre: string;
}
