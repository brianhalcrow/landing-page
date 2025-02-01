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