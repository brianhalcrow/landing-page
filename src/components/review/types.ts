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

export interface Position {
  id: string;
  entity_id: string;
  entity_name: string;
  instrument: string;
  strategy: string;
  base_currency: string;
  quote_currency: string;
  trade_date: string;
  settlement_date: string;
  buy_sell: string;
  buy_sell_currency_code: string;
  buy_sell_amount: number;
  created_by: string;
  trade_request_id: string;
}