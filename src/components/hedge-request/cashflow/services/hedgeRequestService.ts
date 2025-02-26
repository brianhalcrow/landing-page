
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
      // Make sure we don't generate a new ID during insert
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

    // Double check the saved hedge_id
    const { data: savedData, error: checkError } = await supabase
      .from('hedge_accounting_requests')
      .select('hedge_id')
      .eq('hedge_id', hedgeRequest.hedge_id)
      .single();

    if (checkError) {
      console.error('Error verifying saved hedge_id:', checkError);
      throw checkError;
    }

    if (savedData.hedge_id !== hedgeRequest.hedge_id) {
      console.error('Hedge ID mismatch:', { 
        requested: hedgeRequest.hedge_id, 
        saved: savedData.hedge_id 
      });
      throw new Error('Hedge ID mismatch detected');
    }

    return { success: true, hedgeId: hedgeRequest.hedge_id };
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};
