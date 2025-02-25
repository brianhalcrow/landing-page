
import { supabase } from "@/integrations/supabase/client";
import { HedgeAccountingRequest } from "../types";
import { GeneralInformationData } from "../types/general-information";

export const generateHedgeId = async (entityId: string, exposureCategoryL1: string): Promise<string> => {
  console.log('Generating hedge ID for entity:', entityId);
  try {
    const { data, error } = await supabase.rpc('generate_hedge_id', {
      p_entity_id: entityId,
      p_exposure_category_l1: exposureCategoryL1
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

export const saveDraft = async (hedgeRequest: HedgeAccountingRequest) => {
  console.log('Saving hedge request:', hedgeRequest);
  const { error } = await supabase
    .from('hedge_accounting_requests')
    .insert(hedgeRequest);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
};
