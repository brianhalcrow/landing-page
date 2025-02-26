import { FormHeader } from "./components/FormHeader";
import { useFormState } from "./hooks/useFormState";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { toast } from "sonner";
import { calculateProgress } from "./utils/validation";
import type { ExistingHedgeRequest } from "./types";
import type { HedgeLayerDetails } from "./types/hedge-layer";
import { useState, useRef } from "react";
import { FormContent } from "./components/FormContent";

const CashflowHedgeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const exposureDetailsRef = useRef<{ getCurrentLayerData: () => HedgeLayerDetails | null }>();
  
  const formState = useFormState();
  const {
    minimizedSections,
    toggleSection,
    generalInfo,
    hedgingInstrument,
    riskManagement,
    hedgedItem,
    assessmentMonitoring,
    exposureDetails,
    hedgeId,
    setHedgeId
  } = formState;

  const { handleSaveDraft } = useFormSubmission(setHedgeId);

  const onSaveDraft = async () => {
    try {
      const hedgeLayerData = exposureDetailsRef.current?.getCurrentLayerData();

      await handleSaveDraft(
        generalInfo, 
        hedgingInstrument,
        riskManagement,
        hedgedItem,
        assessmentMonitoring,
        exposureDetails,
        hedgeId,
        hedgeLayerData || undefined
      );
      
      const currentProgress = calculateProgress(
        generalInfo,
        riskManagement,
        hedgedItem,
        hedgingInstrument,
        assessmentMonitoring,
        exposureDetails
      );
      setProgress(currentProgress);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const handleSubmit = () => {
    // Submit functionality will be implemented later
  };

  const handleLoadDraft = async (draft: ExistingHedgeRequest) => {
    try {
      setIsLoading(true);
      console.log('Loading draft data:', draft);

      const {
        setGeneralInfo,
        setHedgingInstrument,
        setRiskManagement,
        setHedgedItem,
        setAssessmentMonitoring,
        setExposureDetails
      } = formState;

      await Promise.all([
        setHedgeId(draft.hedge_id),
        setGeneralInfo({
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
        }),
        setHedgingInstrument({
          instrument: draft.instrument,
          forward_element_designation: draft.forward_element_designation,
          currency_basis_spreads: draft.currency_basis_spreads,
          hedging_instrument_description: draft.hedging_instrument_description
        }),
        setRiskManagement({
          risk_management_description: draft.risk_management_description
        }),
        setHedgedItem({
          hedged_item_description: draft.hedged_item_description
        }),
        setAssessmentMonitoring({
          credit_risk_impact: draft.credit_risk_impact,
          oci_reclassification_approach: draft.oci_reclassification_approach,
          economic_relationship: draft.economic_relationship,
          discontinuation_criteria: draft.discontinuation_criteria,
          effectiveness_testing_method: draft.effectiveness_testing_method,
          testing_frequency: draft.testing_frequency,
          assessment_details: draft.assessment_details
        }),
        setExposureDetails({
          start_month: draft.start_month,
          end_month: draft.end_month
        })
      ]);

      const currentProgress = calculateProgress(
        generalInfo,
        riskManagement,
        hedgedItem,
        hedgingInstrument,
        assessmentMonitoring,
        exposureDetails
      );
      setProgress(currentProgress);

      toast.success('Draft loaded successfully');
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading draft...</div>;
  }

  return (
    <div className="max-w-[1525px] mx-auto px-4 space-y-6">
      <FormHeader 
        onSaveDraft={onSaveDraft} 
        onSubmit={handleSubmit}
        onLoadDraft={handleLoadDraft}
        progress={progress}
      />
      
      <FormContent
        formState={formState}
        exposureDetailsRef={exposureDetailsRef}
        minimizedSections={minimizedSections}
        onToggleSection={toggleSection}
        onUpdateGeneralInfo={formState.setGeneralInfo}
        onUpdateHedgingInstrument={formState.setHedgingInstrument}
      />
    </div>
  );
};

export default CashflowHedgeForm;
