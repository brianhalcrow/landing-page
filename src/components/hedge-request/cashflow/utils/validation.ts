
import { GeneralInformationData, RiskManagementData, HedgedItemData, HedgingInstrumentData, AssessmentMonitoringData, ExposureDetailsData } from "../types";

export const validateGeneralInfo = (data: GeneralInformationData) => {
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
  return requiredFields.every(field => !!data[field]);
};

export const validateRiskManagement = (data: RiskManagementData) => {
  return !!data.risk_management_description;
};

export const validateHedgedItem = (data: HedgedItemData) => {
  return !!data.hedged_item_description;
};

export const validateHedgingInstrument = (data: HedgingInstrumentData) => {
  return !!data.instrument && !!data.hedging_instrument_description;
};

export const validateAssessment = (data: AssessmentMonitoringData) => {
  return !!(data.credit_risk_impact || 
    data.oci_reclassification_approach || 
    data.economic_relationship || 
    data.discontinuation_criteria || 
    data.effectiveness_testing_method || 
    data.testing_frequency || 
    data.assessment_details);
};

export const validateExposure = (exposureDetails: ExposureDetailsData) => {
  return exposureDetails.start_month !== undefined && exposureDetails.start_month !== "";
};

export const calculateProgress = (
  generalInfo: GeneralInformationData,
  riskManagement: RiskManagementData,
  hedgedItem: HedgedItemData,
  hedgingInstrument: HedgingInstrumentData,
  assessmentMonitoring: AssessmentMonitoringData,
  exposureDetails: ExposureDetailsData
) => {
  let completeSections = 0;
  
  if (validateGeneralInfo(generalInfo)) completeSections++;
  if (validateRiskManagement(riskManagement)) completeSections++;
  if (validateHedgedItem(hedgedItem)) completeSections++;
  if (validateHedgingInstrument(hedgingInstrument)) completeSections++;
  if (validateAssessment(assessmentMonitoring)) completeSections++;
  if (validateExposure(exposureDetails)) completeSections++;
  
  return Math.round((completeSections / 6) * 100);
};
