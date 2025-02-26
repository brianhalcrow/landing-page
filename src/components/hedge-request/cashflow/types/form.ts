
import { Dispatch, SetStateAction } from 'react';
import { GeneralInformationData } from './general-information';
import { RiskManagementData } from './risk-management';
import { HedgedItemData } from './hedged-item';
import { HedgingInstrumentData } from './hedging-instrument';
import { AssessmentMonitoringData } from './assessment-monitoring';
import { ExposureDetailsData } from './exposure-details';

export interface ExposureForecastData {
  start_month: string;
  end_month: string;
}

export interface FormState {
  generalInfo: GeneralInformationData;
  setGeneralInfo: Dispatch<SetStateAction<GeneralInformationData>>;
  hedgingInstrument: HedgingInstrumentData;
  setHedgingInstrument: Dispatch<SetStateAction<HedgingInstrumentData>>;
  riskManagement: RiskManagementData;
  setRiskManagement: Dispatch<SetStateAction<RiskManagementData>>;
  hedgedItem: HedgedItemData;
  setHedgedItem: Dispatch<SetStateAction<HedgedItemData>>;
  assessmentMonitoring: AssessmentMonitoringData;
  setAssessmentMonitoring: Dispatch<SetStateAction<AssessmentMonitoringData>>;
  exposureForecast: ExposureForecastData;
  setExposureForecast: Dispatch<SetStateAction<ExposureForecastData>>;
  exposureDetails: ExposureDetailsData;
  setExposureDetails: Dispatch<SetStateAction<ExposureDetailsData>>;
  hedgeId: string;
}
