
import { supabase } from "@/integrations/supabase/client";
import { HedgeAccountingRequest } from "../types";

export const generateHedgeId = async (entityId: string, exposureCategoryL1: string): Promise<string> => {
  console.log('Generating hedge ID for entity:', entityId);
  try {
    // Ensure consistent case when calling the function
    const categoryCase = exposureCategoryL1.charAt(0).toUpperCase() + exposureCategoryL1.slice(1).toLowerCase();
    
    const { data, error } = await supabase.rpc('generate_hedge_id', {
      p_entity_id: entityId,
      p_exposure_category_l1: categoryCase
    });

    if (error) {
      console.error('Error generating hedge ID:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No hedge ID was generated');
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
  const { count, error } = await supabase
    .from('hedge_accounting_requests')
    .select('*', { count: 'exact', head: true })
    .eq('hedge_id', hedgeId);

  if (error) {
    console.error('Error checking hedge ID:', error);
    throw error;
  }

  return count ? count > 0 : false;
};

export const saveDraft = async (hedgeRequest: HedgeAccountingRequest) => {
  console.log('Saving hedge request with ID:', hedgeRequest.hedge_id);
  
  try {
    // First check if this hedge_id already exists
    const exists = await checkHedgeIdExists(hedgeRequest.hedge_id);
    
    let error;
    if (exists) {
      console.log('Updating existing draft with hedge_id:', hedgeRequest.hedge_id);
      const { created_at, ...updateData } = hedgeRequest; // Remove created_at from update
      // Update existing draft - only update relevant fields
      ({ error } = await supabase
        .from('hedge_accounting_requests')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('hedge_id', hedgeRequest.hedge_id));
    } else {
      console.log('Creating new draft with hedge_id:', hedgeRequest.hedge_id);
      const { error: insertError } = await supabase
        .from('hedge_accounting_requests')
        .insert([{
          ...hedgeRequest,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      error = insertError;
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
