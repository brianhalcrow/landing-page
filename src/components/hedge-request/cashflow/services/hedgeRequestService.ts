
import { supabase } from "@/integrations/supabase/client";
import { BaseHedgeRequest, ExistingHedgeRequest } from "../types";

// Type matching Supabase's expected structure
interface SupabaseHedgeRequest {
  hedge_id?: string;
  entity_id: string;
  entity_name: string;
  cost_centre: string;
  transaction_currency: string;
  documentation_date: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  hedging_entity: string;
  hedging_entity_fccy: string;
  functional_currency: string;
  risk_management_description: string;
  hedged_item_description: string;
  instrument: string;
  forward_element_designation: string;
  currency_basis_spreads: string;
  hedging_instrument_description: string;
  credit_risk_impact: string;
  oci_reclassification_approach: string;
  economic_relationship: string;
  discontinuation_criteria: string;
  effectiveness_testing_method: string;
  testing_frequency: string;
  assessment_details: string;
  start_month: string | null;
  end_month: string | null;
  status: 'draft';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  approved_at?: string;
  approved_by?: string;
  submitted_at?: string;
  submitted_by?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

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

export const saveDraft = async (hedgeRequest: BaseHedgeRequest | ExistingHedgeRequest) => {
  console.log('Starting save draft operation for hedge request');
  
  try {
    const hedgeId = 'hedge_id' in hedgeRequest ? hedgeRequest.hedge_id : undefined;
    
    // Check if record exists (only if we have a hedge_id)
    const exists = hedgeId ? await checkHedgeIdExists(hedgeId) : false;
    
    let result;
    if (exists) {
      console.log('Updating existing draft:', hedgeId);
      // For updates, we use the request as is since it's an ExistingHedgeRequest
      const { error } = await supabase
        .from('hedge_accounting_requests')
        .update(hedgeRequest as SupabaseHedgeRequest)
        .eq('hedge_id', hedgeId);
        
      if (error) throw error;
      result = { hedge_id: hedgeId };
    } else {
      console.log('Creating new draft');
      // For inserts, convert to Supabase expected format
      const supabaseRequest: SupabaseHedgeRequest = {
        ...hedgeRequest,
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('hedge_accounting_requests')
        .insert(supabaseRequest)
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
