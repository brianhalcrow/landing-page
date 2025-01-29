import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/components/configuration/types";
import { useState, useEffect } from "react";
import { useEntityQuery } from "./useEntityQuery";
import { useEntityManagement } from "./useEntityManagement";
import { useConfigurationSubmit } from "./useConfigurationSubmit";

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
  const { 
    isUpdating, 
    setIsUpdating, 
    fetchExistingConfig, 
    handleCsvUploadComplete 
  } = useEntityManagement(form);
  const { submitConfiguration } = useConfigurationSubmit();

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormChanged(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values: FormValues) => {
    const success = await submitConfiguration(values, isUpdating);
    if (success) {
      setIsUpdating(true);
      setFormChanged(false);
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