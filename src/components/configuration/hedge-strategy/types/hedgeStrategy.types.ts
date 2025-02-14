
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
  strategy: string;
  strategy_name: string;
  strategy_description: string;
  instrument: string;
  counterparty_id: string;
  counterparty_name: string;
  isAssigned: boolean;
  assignmentId?: string;
}
