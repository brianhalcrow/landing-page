
import { GeneralInformationData } from "../types";

export const validateGeneralInfo = (generalInfo: GeneralInformationData): { isValid: boolean; missingFields: string[] } => {
  const requiredFields: (keyof GeneralInformationData)[] = [
    'entity_id',
    'entity_name',
    'cost_centre',
    'transaction_currency',
    'documentation_date',
    'exposure_category_l1',
    'exposure_category_l2',
    'exposure_category_l3',
    'strategy',
    'hedging_entity',
    'hedging_entity_fccy',
    'functional_currency'
  ];

  const missingFields = requiredFields.filter(field => !generalInfo[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
