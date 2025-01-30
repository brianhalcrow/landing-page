import { FormValues } from "@/components/configuration/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useConfigurationSubmit = () => {
  const submitConfiguration = async (values: FormValues, isUpdating: boolean) => {
    try {
      if (!values.entity_id || !values.entity_name) {
        toast.error("Please provide both Entity ID and Entity Name");
        return false;
      }

      const submitData = {
        entity_id: values.entity_id,
        entity_name: values.entity_name,
        functional_currency: values.functional_currency,
        created_at: new Date().toISOString(),
        po: values.po,
        ap: values.ap,
        ar: values.ar,
        other: values.other,
        revenue: values.revenue,
        costs: values.costs,
        net_income: values.net_income,
        ap_realized: values.ap_realized,
        ar_realized: values.ar_realized,
        fx_realized: values.fx_realized,
        net_monetary: values.net_monetary,
        monetary_assets: values.monetary_assets,
        monetary_liabilities: values.monetary_liabilities,
      };

      let error;
      if (isUpdating) {
        const { error: updateError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .update(submitData)
          .eq("entity_id", values.entity_id);
        error = updateError;
        if (!error) {
          toast.success('Configuration updated successfully');
        }
      } else {
        const { error: insertError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .insert(submitData);
        error = insertError;
        if (!error) {
          toast.success('Configuration saved successfully');
        }
      }

      if (error) {
        toast.error('Failed to save configuration');
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error saving hedge configuration:", error);
      toast.error('Failed to save configuration');
      throw error;
    }
  };

  return { submitConfiguration };
};