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