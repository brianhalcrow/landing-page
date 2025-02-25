
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormHeader } from "./components/FormHeader";
import { FormSection } from "./components/FormSection";
import { useFormState } from "./hooks/useFormState";
import { validateGeneralInfo } from "./utils/validation";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import RiskManagementSection from "./sections/RiskManagementSection";
import HedgedItemSection from "./sections/HedgedItemSection";
import HedgingInstrumentSection from "./sections/HedgingInstrumentSection";
import AssessmentMonitoringSection from "./sections/AssessmentMonitoringSection";
import ExposureDetailsSection from "./sections/ExposureDetailsSection";
import { HedgeAccountingRequest } from "./types";

const CashflowHedgeForm = () => {
  const { toast } = useToast();
  const {
    minimizedSections,
    toggleSection,
    generalInfo,
    setGeneralInfo,
    riskManagement,
    hedgedItem,
    hedgingInstrument,
    setHedgingInstrument,
    assessmentMonitoring,
    exposureDetails
  } = useFormState();

  const generateHedgeId = async (entityId: string): Promise<string> => {
    const { data: sequenceData, error: sequenceError } = await supabase
      .from('hedge_request_sequences')
      .select('current_sequence')
      .eq('entity_id', entityId)
      .eq('hedge_type', 'cashflow')
      .single();

    if (sequenceError) {
      // If no sequence exists, create one
      if (sequenceError.code === 'PGRST116') {
        const { data: newSequence, error: createError } = await supabase
          .from('hedge_request_sequences')
          .insert({
            entity_id: entityId,
            hedge_type: 'cashflow',
            current_sequence: 1
          })
          .select()
          .single();

        if (createError) throw createError;
        return `${entityId}-CF-1`;
      }
      throw sequenceError;
    }

    const nextSequence = (sequenceData.current_sequence || 0) + 1;

    const { error: updateError } = await supabase
      .from('hedge_request_sequences')
      .update({ current_sequence: nextSequence })
      .eq('entity_id', entityId)
      .eq('hedge_type', 'cashflow');

    if (updateError) throw updateError;

    return `${entityId}-CF-${nextSequence}`;
  };

  const handleSaveDraft = async () => {
    const { isValid, missingFields } = validateGeneralInfo(generalInfo);
    
    if (!isValid) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in all required fields in General Information section: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const hedge_id = await generateHedgeId(generalInfo.entity_id);

      const hedgeRequest: HedgeAccountingRequest = {
        hedge_id,
        ...generalInfo,
        ...riskManagement,
        ...hedgedItem,
        ...hedgingInstrument,
        ...assessmentMonitoring,
        ...exposureDetails,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('hedge_accounting_requests')
        .insert(hedgeRequest);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error('Error saving hedge request:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    // Submit functionality will be implemented later
  };

  return (
    <div className="max-w-[1525px] mx-auto px-4 space-y-6">
      <FormHeader onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />

      <FormSection 
        title="General Information" 
        section="general"
        isMinimized={minimizedSections.general}
        onToggle={toggleSection}
      >
        <GeneralInformationSection 
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
        />
      </FormSection>

      <FormSection 
        title="Risk Management Objective and Strategy" 
        section="risk"
        isMinimized={minimizedSections.risk}
        onToggle={toggleSection}
      >
        <RiskManagementSection />
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
        />
      </FormSection>

      <FormSection 
        title="Assessment, Effectiveness, and Monitoring" 
        section="assessment"
        isMinimized={minimizedSections.assessment}
        onToggle={toggleSection}
      >
        <AssessmentMonitoringSection />
      </FormSection>

      <FormSection 
        title="Exposure Details" 
        section="exposure"
        isMinimized={minimizedSections.exposure}
        onToggle={toggleSection}
      >
        <ExposureDetailsSection />
      </FormSection>
    </div>
  );
};

export default CashflowHedgeForm;
