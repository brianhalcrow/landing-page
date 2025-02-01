export interface HedgeRequest {
  id: string;
  entity_id: string | null;
  entity_name: string | null;
  cost_centre: string | null;
  functional_currency: string | null;
  exposure_category_l1: string | null;
  exposure_category_l2: string | null;
  exposure_category_l3: string | null;
  strategy: string | null;
  instrument: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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