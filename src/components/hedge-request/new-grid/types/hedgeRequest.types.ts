
export interface HedgeRequest {
  entity_id: string;
  entity_name: string;
  counterparty: string;
  counterparty_name: string;
  strategy: string;
  instrument: string;
  ccy_pair: string;
  trade_date: string;
  settlement_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface EntityCounterparty {
  counterparty_id: string;
  counterparty_name: string;
  relationship_id: string;
  entity_id: string;
}

export interface CounterpartySelectorProps {
  value: string;
  data: Partial<HedgeRequest>;
  node: {
    setData: (data: any) => void;
  };
}
