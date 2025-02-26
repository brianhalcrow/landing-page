
import { supabase } from "@/integrations/supabase/client";
import { HedgeAccountingRequest } from "../types";

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
  console.log('Starting save draft operation for hedge request');
  
  try {
    const hedgeId = hedgeRequest.hedge_id;
    
    // Check if record exists (only if we have a hedge_id)
    const exists = hedgeId ? await checkHedgeIdExists(hedgeId) : false;
    
    let error;
    if (exists) {
      console.log('Updating existing draft:', hedgeId);
      const { created_at, ...updateData } = hedgeRequest;
      ({ error } = await supabase
        .from('hedge_accounting_requests')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('hedge_id', hedgeId));
    } else {
      console.log('Creating new draft');
      // Remove hedge_id from insert if it exists - let the database generate it
      const { hedge_id, ...insertData } = hedgeRequest;
      const { data, error: insertError } = await supabase
        .from('hedge_accounting_requests')
        .insert([{
          ...insertData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('hedge_id')
        .single();
        
      error = insertError;
      if (!error && data) {
        hedgeRequest.hedge_id = data.hedge_id;
      }
    }

    if (error) {
      console.error('Database operation failed:', error);
      throw error;
    }

    return { success: true, hedgeId: hedgeRequest.hedge_id };
  } catch (error) {
    console.error('Error in saveDraft:', error);
    throw error;
  }
};
