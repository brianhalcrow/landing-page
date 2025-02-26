
import { supabase } from "@/integrations/supabase/client";
import { NewHedgeRequest, ExistingHedgeRequest } from "../types";

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

export const saveDraft = async (hedgeRequest: NewHedgeRequest | ExistingHedgeRequest) => {
  console.log('Starting save draft operation for hedge request');
  
  try {
    const hedgeId = ('hedge_id' in hedgeRequest) ? hedgeRequest.hedge_id : undefined;
    
    // Check if record exists (only if we have a hedge_id)
    const exists = hedgeId ? await checkHedgeIdExists(hedgeId) : false;
    
    let result;
    if (exists) {
      console.log('Updating existing draft:', hedgeId);
      const { error } = await supabase
        .from('hedge_accounting_requests')
        .update(hedgeRequest)
        .eq('hedge_id', hedgeId);
        
      if (error) throw error;
      result = { hedge_id: hedgeId };
    } else {
      console.log('Creating new draft');
      const { data, error } = await supabase
        .from('hedge_accounting_requests')
        .insert(hedgeRequest)
        .select('hedge_id')
        .single();
        
      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');
      result = data;
    }

    return { success: true, hedgeId: result.hedge_id };
  } catch (error) {
    console.error('Error in saveDraft:', error);
    throw error;
  }
};
