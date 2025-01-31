import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "../types";
import FormHeader from "./FormHeader";
import FormCategories from "./FormCategories";
import FormFooter from "./FormFooter";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

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
    console.log(data);
    // Handle form submission
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