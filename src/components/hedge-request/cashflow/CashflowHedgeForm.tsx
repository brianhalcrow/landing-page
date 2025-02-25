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
    console.log('Generating hedge ID for entity:', entityId);
    const { data: sequenceData, error: sequenceError } = await supabase
      .from('hedge_request_sequences')
      .select('current_sequence')
      .eq('entity_id', entityId)
      .eq('exposure_category_l1', generalInfo.exposure_category_l1)
      .single();

    if (sequenceError) {
      console.log('Sequence error:', sequenceError);
      // If no sequence exists, create one
      if (sequenceError.code === 'PGRST116') {
        console.log('Creating new sequence for entity:', entityId);
        const { data: newSequence, error: createError } = await supabase
          .from('hedge_request_sequences')
          .insert({
            entity_id: entityId,
            exposure_category_l1: generalInfo.exposure_category_l1,
            current_sequence: 1
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating sequence:', createError);
          throw createError;
        }
        // Return ID in format: CF-[entity_id]-[sequence]
        return `CF-${entityId}-1`;
      }
      throw sequenceError;
    }

    const nextSequence = (sequenceData.current_sequence || 0) + 1;
    console.log('Next sequence number:', nextSequence);

    const { error: updateError } = await supabase
      .from('hedge_request_sequences')
      .update({ current_sequence: nextSequence })
      .eq('entity_id', entityId)
      .eq('exposure_category_l1', generalInfo.exposure_category_l1);

    if (updateError) {
      console.error('Error updating sequence:', updateError);
      throw updateError;
    }

    // Return ID in format: CF-[entity_id]-[sequence]
    return `CF-${entityId}-${nextSequence}`;
  };

  const handleSaveDraft = async () => {
    console.log('Saving draft with general info:', generalInfo);
    const { isValid, missingFields } = validateGeneralInfo(generalInfo);
    
    if (!isValid) {
      console.log('Validation failed. Missing fields:', missingFields);
      toast({
        title: "Required Fields Missing",
        description: `Please fill in all required fields in General Information section: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Generating hedge ID...');
      const hedge_id = await generateHedgeId(generalInfo.entity_id);
      console.log('Generated hedge ID:', hedge_id);

      const now = new Date().toISOString();

      const hedgeRequest: HedgeAccountingRequest = {
        hedge_id,
        ...generalInfo,
        status: 'draft',
        created_at: now,
        updated_at: now,
        // Add required fields with empty values
        risk_management_description: "",
        hedged_item_description: "",
        instrument: hedgingInstrument.instrument || "",
        forward_element_designation: "",
        currency_basis_spreads: "",
        hedging_instrument_description: "",
        credit_risk_impact: "",
        oci_reclassification_approach: "",
        economic_relationship: "",
        discontinuation_criteria: "",
        effectiveness_testing_method: "",
        testing_frequency: "",
        assessment_details: "",
        start_month: now.split('T')[0], // Current date as default
        end_month: now.split('T')[0], // Current date as default
      };

      console.log('Saving hedge request:', hedgeRequest);
      const { error } = await supabase
        .from('hedge_accounting_requests')
        .insert(hedgeRequest);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
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
