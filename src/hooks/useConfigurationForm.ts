import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formSchema, FormValues } from "@/components/configuration/types";
import { useState, useEffect } from "react";
import { useEntityQuery } from "./useEntityQuery";
import { useEntityConfig } from "./useEntityConfig";

export const useConfigurationForm = () => {
  const [formChanged, setFormChanged] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
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
    },
  });

  const { entities, isLoadingEntities, refetchEntities } = useEntityQuery();
  const { isUpdating, fetchExistingConfig, setIsUpdating } = useEntityConfig(form);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormChanged(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleCsvUploadComplete = (updatedEntityIds: string[]) => {
    const currentEntityId = form.getValues("entity_id");
    if (currentEntityId && updatedEntityIds.includes(currentEntityId)) {
      fetchExistingConfig(currentEntityId);
      toast.success('Configuration updated from CSV');
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.entity_id || !values.entity_name) {
        toast.error("Please provide both Entity ID and Entity Name");
        return;
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
      
      setIsUpdating(true);
      setFormChanged(false);
      
    } catch (error) {
      console.error("Error saving hedge configuration:", error);
      toast.error('Failed to save configuration');
      throw error;
    }
  };

  return {
    form,
    entities,
    isLoadingEntities,
    isUpdating,
    formChanged,
    fetchExistingConfig,
    handleCsvUploadComplete,
    onSubmit,
    refetchEntities,
  };
};