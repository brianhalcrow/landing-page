export interface HedgeRequest {
  id: string;
  entity_id: string | null;
  entity_name: string | null;
  instrument: string | null;
  strategy: string | null;
  base_currency: string | null;
  quote_currency: string | null;
  currency_pair: string | null;
  trade_date: string | null;
  settlement_date: string | null;
  buy_sell: string | null;
  buy_sell_currency_code: string | null;
  buy_sell_amount: number | null;
  created_by: string | null;
}
export interface ExposureValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ExposureSelection {
  exposureTypeId: number;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
}

export type ValidateExposuresFn = (
  selections: ExposureSelection[]
) => ExposureValidationResult;
