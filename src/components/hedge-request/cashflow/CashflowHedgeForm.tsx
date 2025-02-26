
import { FormHeader } from "./components/FormHeader";
import { FormSection } from "./components/FormSection";
import { useFormState } from "./hooks/useFormState";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { toast } from "sonner";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import RiskManagementSection from "./sections/RiskManagementSection";
import HedgedItemSection from "./sections/HedgedItemSection";
import HedgingInstrumentSection from "./sections/HedgingInstrumentSection";
import AssessmentMonitoringSection from "./sections/AssessmentMonitoringSection";
import ExposureDetailsSection from "./sections/ExposureDetailsSection";
import type { HedgeAccountingRequest } from "./types";

const CashflowHedgeForm = () => {
  const {
    minimizedSections,
    toggleSection,
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
    exposureDetails,
    setExposureDetails,
    hedgeId,
    setHedgeId
  } = useFormState();

  const { handleSaveDraft } = useFormSubmission(setHedgeId);

  const handleLoadDraft = (draft: HedgeAccountingRequest) => {
    try {
      const updatedGeneralInfo = {
        entity_id: draft.entity_id,
        entity_name: draft.entity_name,
        cost_centre: draft.cost_centre,
        transaction_currency: draft.transaction_currency,
        documentation_date: draft.documentation_date,
        exposure_category_l1: draft.exposure_category_l1,
        exposure_category_l2: draft.exposure_category_l2,
        exposure_category_l3: draft.exposure_category_l3,
        strategy: draft.strategy,
        hedging_entity: draft.hedging_entity,
        hedging_entity_fccy: draft.hedging_entity_fccy,
        functional_currency: draft.functional_currency
      };

      const updatedHedgingInstrument = {
        instrument: draft.instrument,
        forward_element_designation: draft.forward_element_designation,
        currency_basis_spreads: draft.currency_basis_spreads,
        hedging_instrument_description: draft.hedging_instrument_description
      };

      const updatedRiskManagement = {
        risk_management_description: draft.risk_management_description
      };

      const updatedHedgedItem = {
        hedged_item_description: draft.hedged_item_description
      };

      const updatedAssessmentMonitoring = {
        credit_risk_impact: draft.credit_risk_impact,
        oci_reclassification_approach: draft.oci_reclassification_approach,
        economic_relationship: draft.economic_relationship,
        discontinuation_criteria: draft.discontinuation_criteria,
        effectiveness_testing_method: draft.effectiveness_testing_method,
        testing_frequency: draft.testing_frequency,
        assessment_details: draft.assessment_details
      };

      setHedgeId(draft.hedge_id);
      setGeneralInfo(updatedGeneralInfo);
      setHedgingInstrument(updatedHedgingInstrument);
      setRiskManagement(updatedRiskManagement);
      setHedgedItem(updatedHedgedItem);
      setAssessmentMonitoring(updatedAssessmentMonitoring);

      toast.success('Draft loaded successfully');
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
    }
  };

  const onSaveDraft = () => handleSaveDraft(generalInfo, hedgingInstrument);

  const handleSubmit = () => {
    // Submit functionality will be implemented later
  };

  return (
    <div className="max-w-[1525px] mx-auto px-4 space-y-6">
      <FormHeader 
        onSaveDraft={onSaveDraft} 
        onSubmit={handleSubmit}
        onLoadDraft={handleLoadDraft}
      />
      
      <FormSection 
        title="General Information" 
        section="general"
        isMinimized={minimizedSections.general}
        onToggle={toggleSection}
      >
        <GeneralInformationSection 
          generalInfo={generalInfo}
          onChange={setGeneralInfo}
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
            setHedgingInstrument(prev => ({
              ...prev,
              instrument
            }));
          }}
          hedgeId={hedgeId}
        />
      </FormSection>

      <FormSection 
        title="Risk Management Objective and Strategy" 
        section="risk"
        isMinimized={minimizedSections.risk}
        onToggle={toggleSection}
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
        onToggle={toggleSection}
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
        onToggle={toggleSection}
      >
        <HedgingInstrumentSection 
          selectedStrategy={generalInfo.strategy}
          instrumentType={hedgingInstrument.instrument}
          value={hedgingInstrument}
          onChange={setHedgingInstrument}
        />
      </FormSection>

      <FormSection 
        title="Assessment, Effectiveness, and Monitoring" 
        section="assessment"
        isMinimized={minimizedSections.assessment}
        onToggle={toggleSection}
      >
        <AssessmentMonitoringSection 
          value={assessmentMonitoring}
          onChange={setAssessmentMonitoring}
        />
      </FormSection>

      <FormSection 
        title="Exposure Details" 
        section="exposure"
        isMinimized={minimizedSections.exposure}
        onToggle={toggleSection}
      >
        <ExposureDetailsSection 
          value={exposureDetails}
          onChange={setExposureDetails}
          documentationDate={generalInfo.documentation_date}
        />
      </FormSection>
    </div>
  );
};

export default CashflowHedgeForm;
