
export interface LegalEntity {
  entity_id: string;
  entity_name: string;
  local_currency: string;
  functional_currency: string;
  accounting_rate_method: string;
  exposure_configs?: Record<number, boolean>;
}

export interface PendingChanges {
  [entityId: string]: {
    [exposureTypeId: number]: boolean;
  };
}
