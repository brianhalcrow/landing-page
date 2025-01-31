import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "../types";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConfigurationFormProps {
  entities: Tables<'config_entity'>[];
}

const ConfigurationForm = ({ entities }: ConfigurationFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
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

  // Watch for form changes
  form.watch(() => {
    setFormChanged(true);
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting configuration:", data);
      
      const { error } = await supabase
        .from("config_exposures")
        .upsert({
          entity_id: data.entity_id,
          entity_name: data.entity_name,
          functional_currency: data.functional_currency,
          created_at: new Date().toISOString(),
          po: data.po,
          ap: data.ap,
          ar: data.ar,
          other: data.other,
          revenue: data.revenue,
          costs: data.costs,
          net_income: data.net_income,
          ap_realized: data.ap_realized,
          ar_realized: data.ar_realized,
          fx_realized: data.fx_realized,
          net_monetary: data.net_monetary,
          monetary_assets: data.monetary_assets,
          monetary_liabilities: data.monetary_liabilities,
        }, {
          onConflict: 'entity_id'
        });

      if (error) {
        console.error("Error saving configuration:", error);
        toast.error("Failed to save configuration");
        throw error;
      }

      toast.success("Configuration saved successfully");
      setIsUpdating(true);
      setFormChanged(false);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to save configuration");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormHeader 
          form={form} 
          entities={entities} 
          isLoadingEntities={false} 
          onFetchConfig={async (entityId) => {}} 
          onUploadComplete={() => {}} 
        />
        <FormCategories form={form} />
        <FormFooter 
          isUpdating={isUpdating}
          formChanged={formChanged}
        />
      </form>
    </Form>
  );
};

export default ConfigurationForm;