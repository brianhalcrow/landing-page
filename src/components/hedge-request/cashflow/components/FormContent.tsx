
import { FormSection } from "./FormSection";
import GeneralInformationSection from "../sections/GeneralInformationSection";
import RiskManagementSection from "../sections/RiskManagementSection";
import HedgedItemSection from "../sections/HedgedItemSection";
import HedgingInstrumentSection from "../sections/HedgingInstrumentSection";
import AssessmentMonitoringSection from "../sections/AssessmentMonitoringSection";
import ExposureForecastSection from "../sections/ExposureForecastSection";
import ExposureDetailsSection from "../sections/ExposureDetailsSection";
import type { HedgeLayerDetails } from "../types/hedge-layer";
import { RefObject } from "react";
import type { FormState } from "../types/form";

interface FormContentProps {
  formState: FormState;
  exposureDetailsRef: RefObject<{ getCurrentLayerData: () => HedgeLayerDetails | null }>;
  minimizedSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
  onUpdateGeneralInfo: (value: any) => void;
  onUpdateHedgingInstrument: (value: any) => void;
}

export const FormContent = ({
  formState,
  exposureDetailsRef,
  minimizedSections,
  onToggleSection,
  onUpdateGeneralInfo,
  onUpdateHedgingInstrument
}: FormContentProps) => {
  const {
    generalInfo,
    setGeneralInfo,
    hedgingInstrument,
    setHedgingInstrument,
    riskManagement,
    setRiskManagement,
    hedgedItem,
    setHedgedItem,
    assessmentMonitoring,
    setAssessmentMonitoring,
    exposureForecast,
    setExposureForecast,
    exposureDetails,
    setExposureDetails,
    hedgeId
  } = formState;

  return (
    <>
      <FormSection 
        title="General Information" 
        section="general"
        isMinimized={minimizedSections.general}
        onToggle={onToggleSection}
      >
        <GeneralInformationSection 
          generalInfo={generalInfo}
          onChange={onUpdateGeneralInfo}
          onExposureCategoryL2Change={(value) => {
            setGeneralInfo(prev => ({
              ...prev,
              exposure_category_l2: value
            }));
          }}
          onStrategyChange={(value, instrument) => {
            setGeneralInfo(prev => ({
              ...prev,
              strategy: value
            }));
            onUpdateHedgingInstrument({ ...hedgingInstrument, instrument });
          }}
          hedgeId={hedgeId}
        />
      </FormSection>

      <FormSection 
        title="Risk Management Objective and Strategy" 
        section="risk"
        isMinimized={minimizedSections.risk}
        onToggle={onToggleSection}
      >
        <RiskManagementSection 
          value={riskManagement.risk_management_description}
          onChange={(value) => setRiskManagement({ risk_management_description: value })}
        />
      </FormSection>

      <FormSection 
        title="Hedged Item Details" 
        section="hedgedItem"
        isMinimized={minimizedSections.hedgedItem}
        onToggle={onToggleSection}
      >
        <HedgedItemSection 
          exposureCategoryL2={generalInfo.exposure_category_l2}
          onExposureCategoryL2Change={(value) => {
            setGeneralInfo(prev => ({
              ...prev,
              exposure_category_l2: value
            }));
          }}
          selectedStrategy={generalInfo.strategy}
          value={hedgedItem.hedged_item_description}
          onChange={(value) => setHedgedItem({ hedged_item_description: value })}
        />
      </FormSection>

      <FormSection 
        title="Hedging Instrument" 
        section="hedgingInstrument"
        isMinimized={minimizedSections.hedgingInstrument}
        onToggle={onToggleSection}
      >
        <HedgingInstrumentSection 
          selectedStrategy={generalInfo.strategy}
          instrumentType={hedgingInstrument.instrument}
          value={hedgingInstrument}
          onChange={onUpdateHedgingInstrument}
        />
      </FormSection>

      <FormSection 
        title="Assessment, Effectiveness, and Monitoring" 
        section="assessment"
        isMinimized={minimizedSections.assessment}
        onToggle={onToggleSection}
      >
        <AssessmentMonitoringSection 
          value={assessmentMonitoring}
          onChange={setAssessmentMonitoring}
        />
      </FormSection>

      <FormSection 
        title="Exposure Forecast" 
        section="forecast"
        isMinimized={minimizedSections.forecast}
        onToggle={onToggleSection}
      >
        <ExposureForecastSection 
          value={exposureForecast}
          onChange={setExposureForecast}
          documentationDate={generalInfo.documentation_date}
          hedgeId={hedgeId}
        />
      </FormSection>

      <FormSection 
        title="Exposure Details" 
        section="exposure"
        isMinimized={minimizedSections.exposure}
        onToggle={onToggleSection}
      >
        <ExposureDetailsSection 
          ref={exposureDetailsRef}
          value={exposureDetails}
          onChange={setExposureDetails}
          documentationDate={generalInfo.documentation_date}
          hedgeId={hedgeId}
        />
      </FormSection>
    </>
  );
};
