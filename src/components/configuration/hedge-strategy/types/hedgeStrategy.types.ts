
export interface HedgeStrategyAssignment {
  id: string;
  entity_id: string;
  counterparty_id: string;
  hedge_strategy_id: number;
  created_at?: string;
}

export interface HedgeStrategyGridRow {
  entity_id: string;
  entity_name: string;
  exposure_category_l2: string;
  strategy: string;
  strategy_description: string;
  instrument: string;
  counterparty_id: string;
  counterparty_name: string;
  isAssigned: boolean;
  assignmentId?: string;
}
