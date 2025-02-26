
import { supabase } from "@/integrations/supabase/client";
import { HedgeAccountingRequest } from "../types";

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

export const checkHedgeIdExists = async (hedgeId: string): Promise<boolean> => {
  console.log('Checking if hedge ID exists:', hedgeId);
  const { data, error } = await supabase
    .from('hedge_accounting_requests')
    .select('hedge_id')
    .eq('hedge_id', hedgeId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking hedge ID:', error);
    throw error;
  }

  return !!data;
};

export const saveDraft = async (hedgeRequest: HedgeAccountingRequest) => {
  console.log('Saving hedge request:', hedgeRequest);
  
  try {
    // First check if this hedge_id already exists
    const exists = await checkHedgeIdExists(hedgeRequest.hedge_id);
    
    let error;
    if (exists) {
      console.log('Updating existing draft with hedge_id:', hedgeRequest.hedge_id);
      // Update existing draft
      ({ error } = await supabase
        .from('hedge_accounting_requests')
        .update({
          ...hedgeRequest,
          updated_at: new Date().toISOString()
        })
        .eq('hedge_id', hedgeRequest.hedge_id));
    } else {
      console.log('Creating new draft with hedge_id:', hedgeRequest.hedge_id);
      // Insert new draft
      ({ error } = await supabase
        .from('hedge_accounting_requests')
        .insert({
          ...hedgeRequest,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
    }

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return { success: true, hedgeId: hedgeRequest.hedge_id };
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};
