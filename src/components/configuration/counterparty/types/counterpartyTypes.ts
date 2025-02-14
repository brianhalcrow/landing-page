
export interface Counterparty {
  counterparty_id: string;
  counterparty_name: string | null;
  counterparty_type: string | null;
  country: string | null;
}

export interface LegalEntity {
  entity_id: string;
  entity_name: string;
}

export interface EntityCounterparty {
  entity_id: string;
  counterparty_id: string;
  relationship_id: string;
}

export interface PendingChanges {
  [entityId: string]: {
    [counterpartyId: string]: boolean;
  };
}
