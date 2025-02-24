
export interface Entity {
  entityName: string;
  entityId: string;
  functionalCurrency: string;
}

export interface EntityHedge {
  id: string;
  entityId: string;
  entityName: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: string;
}
