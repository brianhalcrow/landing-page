
import { supabase } from "@/integrations/supabase/client";
import type { HedgeLayerDetails, HedgeLayerMonthlyData } from "../types/hedge-layer";
import { toast } from "sonner";

export const saveHedgeLayerDetails = async (layerDetails: HedgeLayerDetails): Promise<boolean> => {
  try {
    // First delete existing entries for this hedge_id and layer_number
    const { error: deleteError } = await supabase
      .from('hedge_layer_details')
      .delete()
      .eq('hedge_id', layerDetails.hedge_id)
      .eq('layer_number', layerDetails.layer_number);

    if (deleteError) {
      console.error('Error deleting existing hedge layer details:', deleteError);
      throw deleteError;
    }

    // Transform the data into the database format
    const dbRows = layerDetails.monthly_data.map((monthData) => ({
      hedge_id: layerDetails.hedge_id,
      layer_number: layerDetails.layer_number,
      layer_percentage: layerDetails.layer_percentage,
      hedge_ratio: layerDetails.hedge_ratio,
      start_month: layerDetails.start_month,
      end_month: layerDetails.end_month,
      month_index: monthData.month_index,
      revenue: monthData.revenue,
      costs: monthData.costs,
      net_income: monthData.net_income,
      hedged_exposure: monthData.hedged_exposure,
      hedge_layer_amount: monthData.hedge_layer_amount,
      indicative_coverage_percentage: monthData.indicative_coverage_percentage,
      cumulative_layer_amount: monthData.cumulative_layer_amount,
      cumulative_coverage_percentage: monthData.cumulative_coverage_percentage,
    }));

    const { error: insertError } = await supabase
      .from('hedge_layer_details')
      .insert(dbRows);

    if (insertError) {
      console.error('Error inserting hedge layer details:', insertError);
      throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error in saveHedgeLayerDetails:', error);
    toast.error('Failed to save hedge layer details');
    return false;
  }
};

export const getHedgeLayerDetails = async (hedgeId: string): Promise<HedgeLayerDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('hedge_layer_details')
      .select('*')
      .eq('hedge_id', hedgeId)
      .order('layer_number, month_index');

    if (error) {
      console.error('Error fetching hedge layer details:', error);
      throw error;
    }

    // Transform database rows into HedgeLayerDetails structure
    const layerMap = new Map<number, HedgeLayerDetails>();

    data.forEach((row) => {
      if (!layerMap.has(row.layer_number)) {
        layerMap.set(row.layer_number, {
          hedge_id: row.hedge_id,
          layer_number: row.layer_number,
          layer_percentage: row.layer_percentage,
          hedge_ratio: row.hedge_ratio,
          start_month: row.start_month,
          end_month: row.end_month,
          monthly_data: [],
        });
      }

      const monthlyData: HedgeLayerMonthlyData = {
        month_index: row.month_index,
        revenue: row.revenue || 0,
        costs: row.costs || 0,
        net_income: row.net_income || 0,
        hedged_exposure: row.hedged_exposure || 0,
        hedge_layer_amount: row.hedge_layer_amount || 0,
        indicative_coverage_percentage: row.indicative_coverage_percentage || 0,
        cumulative_layer_amount: row.cumulative_layer_amount || 0,
        cumulative_coverage_percentage: row.cumulative_coverage_percentage || 0,
      };

      layerMap.get(row.layer_number)?.monthly_data.push(monthlyData);
    });

    return Array.from(layerMap.values());
  } catch (error) {
    console.error('Error in getHedgeLayerDetails:', error);
    toast.error('Failed to load hedge layer details');
    return [];
  }
};
