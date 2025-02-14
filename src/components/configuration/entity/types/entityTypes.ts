
export interface LegalEntity {
  entity_id: string;
  entity_name: string;
  local_currency: string;
  functional_currency: string;
  accounting_rate_method: string;
  exposure_configs?: Record<string, boolean>;
}

export interface PendingChanges {
  [entityId: string]: {
    [counterpartyId: string]: boolean;
  };
}

export interface Counterparty {
  counterparty_id: string;
  counterparty_name: string | null;
  counterparty_type: string | null;
  country: string | null;
}
