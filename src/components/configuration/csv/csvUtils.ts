import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from 'papaparse';
import { Tables } from "@/integrations/supabase/types";

export type CsvRow = {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  po: string;
  ap: string;
  ar: string;
  other: string;
  revenue: string;
  costs: string;
  net_income: string;
  ap_realized: string;
  ar_realized: string;
  fx_realized: string;
  net_monetary: string;
  monetary_assets: string;
  monetary_liabilities: string;
};

export const processUploadedData = async (data: any[]): Promise<string[]> => {
  const rows = data.slice(1).filter(row => row.length > 1);
  let successCount = 0;
  let errorCount = 0;
  const updatedEntityIds: string[] = [];

  for (const row of rows) {
    const [
      entity_id, entity_name, functional_currency, po, ap, ar, other, revenue, costs,
      net_income, ap_realized, ar_realized, fx_realized, net_monetary,
      monetary_assets, monetary_liabilities
    ] = row;

    // Delete existing record if it exists
    const { error: deleteError } = await supabase
      .from("config_exposures")
      .delete()
      .eq("entity_id", entity_id);

    if (deleteError) {
      console.error('Error deleting existing record:', deleteError);
      errorCount++;
      continue;
    }

    // Insert new record
    const { error: insertError } = await supabase
      .from("config_exposures")
      .insert({
        entity_id,
        entity_name,
        functional_currency,
        po: po === 'true',
        ap: ap === 'true',
        ar: ar === 'true',
        other: other === 'true',
        revenue: revenue === 'true',
        costs: costs === 'true',
        net_income: net_income === 'true',
        ap_realized: ap_realized === 'true',
        ar_realized: ar_realized === 'true',
        fx_realized: fx_realized === 'true',
        net_monetary: net_monetary === 'true',
        monetary_assets: monetary_assets === 'true',
        monetary_liabilities: monetary_liabilities === 'true',
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting row:', insertError);
      errorCount++;
    } else {
      successCount++;
      updatedEntityIds.push(entity_id);
    }
  }

  if (errorCount === 0) {
    toast.success(`Successfully uploaded ${successCount} configurations`);
  } else {
    toast.warning(`Uploaded ${successCount} configurations with ${errorCount} errors`);
  }

  return updatedEntityIds;
};

export const checkExistingConfigs = async (entityIds: string[]): Promise<boolean> => {
  const { data: existingConfigs, error } = await supabase
    .from("config_exposures")
    .select("entity_id")
    .in("entity_id", entityIds);

  if (error) {
    console.error('Error checking existing configs:', error);
    return false;
  }

  return existingConfigs.length > 0;
};

export const downloadConfigurations = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("config_exposures")
    .select("*");

  if (error) {
    console.error('Error downloading configurations:', error);
    return null;
  }

  return Papa.unparse(data);
};