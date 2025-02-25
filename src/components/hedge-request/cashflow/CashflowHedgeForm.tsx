
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
    try {
      const { data, error } = await supabase.rpc('generate_hedge_id', {
        p_entity_id: entityId,
        p_exposure_category_l1: generalInfo.exposure_category_l1
      });

      if (error) {
        console.error('Error generating hedge ID:', error);
        throw error;
      }

      console.log('Generated hedge ID:', data);
      return data;
    } catch (error) {
      console.error('Failed to generate hedge ID:', error);
      throw error;
    }
  };

  const handleSaveDraft = async () => {
    console.log('Saving draft with general info:', generalInfo);
    const { isValid, missingFields } = validateGeneralInfo(generalInfo);
    
    if (!isValid) {
      console.log('Validation failed. Missing fields:', missingFields);
      toast({
        title: "Required Fields Missing",
        description: `Please complete the following fields in General Information: ${missingFields.join(', ')}`,
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
        assessment_details: ""
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
        title: "Draft Saved",
        description: `Hedge request ${hedge_id} has been saved as draft successfully.`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error saving hedge request:', error);
      toast({
        title: "Error Saving Draft",
        description: error.code === 'PGRST301' 
          ? "Database connection error. Please check your connection and try again."
          : `Failed to save draft: ${error.message}. Please try again or contact support if the issue persists.`,
        variant: "destructive"
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
