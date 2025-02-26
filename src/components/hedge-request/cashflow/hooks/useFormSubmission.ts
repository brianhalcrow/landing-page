
import { toast } from "sonner";
import { validateGeneralInfo } from "../utils/validation";
import { saveDraft } from "../services/hedgeRequestService";
import { saveHedgeLayerDetails } from "../services/hedgeLayerService";
import { GeneralInformationData } from "../types/general-information";
import { HedgingInstrumentData, RiskManagementData, HedgedItemData, AssessmentMonitoringData, ExposureDetailsData } from "../types";
import { convertToDBDate } from "../utils/dateTransformations";
import type { HedgeLayerDetails } from "../types/hedge-layer";

export const useFormSubmission = (setHedgeId: (id: string) => void) => {
  const handleSaveDraft = async (
    generalInfo: GeneralInformationData,
    hedgingInstrument: HedgingInstrumentData,
    riskManagement: RiskManagementData,
    hedgedItem: HedgedItemData,
    assessmentMonitoring: AssessmentMonitoringData,
    exposureDetails: ExposureDetailsData,
    existingHedgeId?: string,
    hedgeLayerData?: HedgeLayerDetails
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
      const dbStartMonth = convertToDBDate(exposureDetails.start_month);
      const dbEndMonth = convertToDBDate(exposureDetails.end_month);

      const hedgeRequest = {
        ...generalInfo,
        ...riskManagement,
        ...hedgedItem,
        ...hedgingInstrument,
        ...assessmentMonitoring,
        status: 'draft' as const,
        start_month: dbStartMonth,
        end_month: dbEndMonth,
      };

      if (existingHedgeId) {
        Object.assign(hedgeRequest, { hedge_id: existingHedgeId });
      }

      // Save hedge request first
      const result = await saveDraft(hedgeRequest);
      const hedgeRequestId = result.hedgeId;
      
      // Only set the hedge ID if this is a new draft
      if (!existingHedgeId && hedgeRequestId) {
        setHedgeId(hedgeRequestId);
      }

      // If we have hedge layer data and a valid hedge ID, save it
      if (hedgeLayerData && hedgeRequestId) {
        const layerData = {
          ...hedgeLayerData,
          hedge_id: hedgeRequestId
        };
        
        const layerSaveResult = await saveHedgeLayerDetails(layerData);
        if (!layerSaveResult) {
          throw new Error('Failed to save hedge layer details');
        }
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
