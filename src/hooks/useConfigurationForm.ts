import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formSchema, FormValues } from "@/components/configuration/types";
import { useState, useEffect } from "react";

export const useConfigurationForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
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

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormChanged(true);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const { 
    data: entities, 
    isLoading: isLoadingEntities,
    refetch: refetchEntities 
  } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_entity")
        .select("*");
      
      if (error) {
        console.error('Error fetching entities:', error);
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      return data;
    },
  });

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
        setFormChanged(false);
        toast.success('Configuration loaded successfully');
      } else {
        form.reset({
          entity_id: entityId,
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
        setFormChanged(false);
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

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.entity_id) {
        toast.error("Please select an entity");
        return;
      }

      const selectedEntity = entities?.find(e => e.entity_id === values.entity_id);
      if (!selectedEntity) {
        toast.error("Selected entity not found");
        return;
      }

      const submitData = {
        entity_id: values.entity_id,
        entity_name: selectedEntity.entity_name || '',
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
        created_at: new Date().toISOString(),
      };

      let error;
      if (isUpdating) {
        const { error: updateError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .update(submitData)
          .eq("entity_id", values.entity_id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .insert(submitData);
        error = insertError;
      }

      if (error) throw error;
      
      setIsUpdating(true);
      setFormChanged(false);
      
    } catch (error) {
      console.error("Error saving hedge configuration:", error);
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