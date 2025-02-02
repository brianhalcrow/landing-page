export interface HedgeRequestDraft {
  id?: number;
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  cost_centre: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy_description: string;
  instrument: string;
}

export interface ValidEntity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
}

export interface HedgeRequestDraftTrade {
  id?: number;
  draft_id: string;
  base_currency: string;
  quote_currency: string;
  currency_pair: string;
  trade_date: string;
  settlement_date: string;
  buy_sell: 'BUY' | 'SELL';
  buy_sell_currency_code: string;
  buy_sell_amount: number;
}