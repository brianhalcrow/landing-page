
import { useToast } from "@/hooks/use-toast";
import { validateGeneralInfo } from "../utils/validation";
import { saveDraft } from "../services/hedgeRequestService";
import { GeneralInformationData } from "../types/general-information";
import { HedgingInstrumentData, RiskManagementData, HedgedItemData, AssessmentMonitoringData, ExposureDetailsData } from "../types";
import { convertToDBDate } from "../utils/dateTransformations";

export const useFormSubmission = (setHedgeId: (id: string) => void) => {
  const { toast } = useToast();

  const handleSaveDraft = async (
    generalInfo: GeneralInformationData,
    hedgingInstrument: HedgingInstrumentData,
    riskManagement: RiskManagementData,
    hedgedItem: HedgedItemData,
    assessmentMonitoring: AssessmentMonitoringData,
    exposureDetails: ExposureDetailsData,
    existingHedgeId?: string
  ) => {
    console.log('Saving draft with general info:', generalInfo);
    const validationResult = validateGeneralInfo(generalInfo);
    
    if (!validationResult.isValid) {
      console.log('Validation failed. Missing fields:', validationResult.missingFields);
      toast({
        title: "Required Fields Missing",
        description: `Please complete the following fields in General Information: ${validationResult.missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      const dbStartMonth = convertToDBDate(exposureDetails.start_month);
      const dbEndMonth = convertToDBDate(exposureDetails.end_month);

      const hedgeRequest = {
        hedge_id: existingHedgeId,
        ...generalInfo,
        ...riskManagement,
        ...hedgedItem,
        ...hedgingInstrument,
        ...assessmentMonitoring,
        status: 'draft' as const,
        start_month: dbStartMonth,
        end_month: dbEndMonth,
        updated_at: now,
        created_at: now
      };

      const result = await saveDraft(hedgeRequest);
      
      // Only set the hedge ID if this is a new draft
      if (!existingHedgeId && result.hedgeId) {
        setHedgeId(result.hedgeId);
      }
      
      toast({
        title: existingHedgeId ? "Draft Updated" : "Draft Saved",
        description: `Hedge request ${result.hedgeId} has been ${existingHedgeId ? 'updated' : 'saved'} successfully.`,
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
