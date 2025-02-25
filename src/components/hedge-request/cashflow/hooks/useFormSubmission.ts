
import { useToast } from "@/hooks/use-toast";
import { validateGeneralInfo } from "../utils/validation";
import { generateHedgeId, saveDraft } from "../services/hedgeRequestService";
import { GeneralInformationData } from "../types/general-information";
import { HedgingInstrumentData } from "../types";

export const useFormSubmission = () => {
  const { toast } = useToast();

  const handleSaveDraft = async (
    generalInfo: GeneralInformationData,
    hedgingInstrument: HedgingInstrumentData
  ) => {
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
      const hedge_id = await generateHedgeId(generalInfo.entity_id, generalInfo.exposure_category_l1);
      const now = new Date().toISOString();

      const hedgeRequest = {
        hedge_id,
        ...generalInfo,
        status: 'draft' as const,
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
        assessment_details: "",
        start_month: null,
        end_month: null
      };

      await saveDraft(hedgeRequest);
      
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

  return { handleSaveDraft };
};
