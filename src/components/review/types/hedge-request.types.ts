export interface HedgeRequestDraftTrade {
  id: number;
  draft_id: string | null;
  buy_currency: string | null;
  sell_currency: string | null;
  buy_amount: number | null;
  sell_amount: number | null;
  trade_date: string | null;
  settlement_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  entity_id: string | null;
  entity_name: string | null;
}

export interface HedgeRequestDraft {
  id: number;
  entity_id: string | null;
  entity_name: string | null;
  cost_centre: string | null;
  functional_currency: string | null;
  exposure_category_l1: string | null;
  exposure_category_l2: string | null;
  exposure_category_l3: string | null;
  strategy_description: string | null;
  instrument: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface HedgeRequestOverview extends Omit<HedgeRequestDraft, 'trades'> {
  trade_id: number | null;
  draft_id: string | null;
  buy_currency: string | null;
  sell_currency: string | null;
  buy_amount: number | null;
  sell_amount: number | null;
  trade_date: string | null;
  settlement_date: string | null;
  trade_created_at: string | null;
  trade_updated_at: string | null;
  trade_entity_id: string | null;
  trade_entity_name: string | null;
}