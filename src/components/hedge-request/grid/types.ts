export interface HedgeRequestDraft {
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
  draft_id: string;
  buy_currency: string;
  sell_currency: string;
  trade_date: string;
  settlement_date: string;
  buy_amount: number;
  sell_amount: number;
  entity_id?: string;
  entity_name?: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
}