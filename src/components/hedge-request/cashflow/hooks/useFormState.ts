import { useState } from 'react';
import { 
  GeneralInformationData,
  RiskManagementData,
  HedgedItemData,
  HedgingInstrumentData,
  AssessmentMonitoringData,
  ExposureDetailsData
} from '../types';

export interface HedgeLayerState {
  hedgeRatio: string;
  hedgeLayerPercentage: string;
  revenues: Record<number, number>;
  costs: Record<number, number>;
  selectedDate?: Date;
}

export const useFormState = () => {
  const [minimizedSections, setMinimizedSections] = useState<Record<string, boolean>>({
    general: false,
    risk: false,
    hedgedItem: false,
    hedgingInstrument: false,
    assessment: false,
    exposure: false
  });

  const [hedgeId, setHedgeId] = useState<string>("");

  const [generalInfo, setGeneralInfo] = useState<GeneralInformationData>({
    entity_id: "",
    entity_name: "",
    cost_centre: "",
    transaction_currency: "",
    documentation_date: "",
    exposure_category_l1: "",
    exposure_category_l2: "",
    exposure_category_l3: "",
    strategy: "",
    hedging_entity: "",
    hedging_entity_fccy: "",
    functional_currency: ""
  });

  const [hedgeLayerData, setHedgeLayerData] = useState<HedgeLayerState>({
    hedgeRatio: '',
    hedgeLayerPercentage: '',
    revenues: {},
    costs: {},
    selectedDate: undefined
  });

  const [riskManagement, setRiskManagement] = useState<RiskManagementData>({
    risk_management_description: ""
  });

  const [hedgedItem, setHedgedItem] = useState<HedgedItemData>({
    hedged_item_description: ""
  });

  const [hedgingInstrument, setHedgingInstrument] = useState<HedgingInstrumentData>({
    instrument: "",
    forward_element_designation: "",
    currency_basis_spreads: "",
    hedging_instrument_description: ""
  });

  const [assessmentMonitoring, setAssessmentMonitoring] = useState<AssessmentMonitoringData>({
    credit_risk_impact: "",
    oci_reclassification_approach: "",
    economic_relationship: "",
    discontinuation_criteria: "",
    effectiveness_testing_method: "",
    testing_frequency: "",
    assessment_details: ""
  });

  const [exposureDetails, setExposureDetails] = useState<ExposureDetailsData>({
    start_month: "",
    end_month: ""
  });

  const toggleSection = (section: string) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    minimizedSections,
    toggleSection,
    hedgeId,
    setHedgeId,
    generalInfo,
    setGeneralInfo,
    riskManagement,
    setRiskManagement,
    hedgedItem,
    setHedgedItem,
    hedgingInstrument,
    setHedgingInstrument,
    assessmentMonitoring,
    setAssessmentMonitoring,
    exposureDetails,
    setExposureDetails,
    hedgeLayerData,
    setHedgeLayerData
  };
};
