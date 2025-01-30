import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/configuration/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEntityManagement = (form: UseFormReturn<FormValues>) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchExistingConfig = async (entityId: string) => {
    try {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .select()
        .eq("entity_id", entityId)
        .maybeSingle();

      if (error) {
        toast.error('Failed to fetch existing configuration');
        throw error;
      }

      if (data) {
        form.reset({
          entity_id: data.entity_id,
          entity_name: data.entity_name,
          functional_currency: data.functional_currency,
          po: data.po || false,
          ap: data.ap || false,
          ar: data.ar || false,
          other: data.other || false,
          revenue: data.revenue || false,
          costs: data.costs || false,
          net_income: data.net_income || false,
          ap_realized: data.ap_realized || false,
          ar_realized: data.ar_realized || false,
          fx_realized: data.fx_realized || false,
          net_monetary: data.net_monetary || false,
          monetary_assets: data.monetary_assets || false,
          monetary_liabilities: data.monetary_liabilities || false,
        });
        setIsUpdating(true);
        toast.success('Configuration loaded successfully');
      } else {
        form.reset({
          entity_id: entityId,
          entity_name: "",
          functional_currency: "",
          po: false,
          ap: false,
          ar: false,
          other: false,
          revenue: false,
          costs: false,
          net_income: false,
          ap_realized: false,
          ar_realized: false,
          fx_realized: false,
          net_monetary: false,
          monetary_assets: false,
          monetary_liabilities: false,
        });
        setIsUpdating(false);
        toast.info('No existing configuration found. Creating new configuration.');
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
      toast.error('Failed to fetch configuration');
    }
  };

  const handleCsvUploadComplete = (updatedEntityIds: string[]) => {
    const currentEntityId = form.getValues("entity_id");
    if (currentEntityId && updatedEntityIds.includes(currentEntityId)) {
      fetchExistingConfig(currentEntityId);
      toast.success('Configuration updated from CSV');
    }
  };

  return {
    isUpdating,
    setIsUpdating,
    fetchExistingConfig,
    handleCsvUploadComplete,
  };
};