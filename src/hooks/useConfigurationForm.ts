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
      if (!values.entity_id) {
        toast.error("Please select an entity");
        return;
      }

      const submitData = {
        ...values,
        created_at: new Date().toISOString(),
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