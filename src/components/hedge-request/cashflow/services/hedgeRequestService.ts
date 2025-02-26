
import { supabase } from "@/integrations/supabase/client";
import { HedgeAccountingRequest } from "../types";

export const generateHedgeId = async (entityId: string, exposureCategoryL1: string): Promise<string> => {
  console.log('Generating hedge ID for entity:', entityId, 'category:', exposureCategoryL1);
  try {
    // Start a new transaction
    const { data, error } = await supabase.rpc('generate_hedge_id', {
      p_entity_id: entityId,
      p_exposure_category_l1: 'Cashflow' // Always use correct case
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
  console.log('Starting save draft operation for hedge request');
  
  try {
    let hedgeId = hedgeRequest.hedge_id;
    
    if (!hedgeId) {
      // Generate new hedge ID if not provided
      hedgeId = await generateHedgeId(hedgeRequest.entity_id, 'Cashflow');
      hedgeRequest.hedge_id = hedgeId;
    }
    
    console.log('Using hedge ID for save operation:', hedgeId);
    
    // Check if record exists
    const exists = await checkHedgeIdExists(hedgeId);
    
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
      console.log('Creating new draft:', hedgeId);
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
      console.error('Database operation failed:', error);
      throw error;
    }

    return { success: true, hedgeId };
  } catch (error) {
    console.error('Error in saveDraft:', error);
    throw error;
  }
};
