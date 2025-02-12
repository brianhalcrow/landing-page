
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

export interface ValidEntity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
}
