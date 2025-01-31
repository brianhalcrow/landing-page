import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormValues, formSchema } from "./types";
import { useEntities } from "@/hooks/useEntities";
import EntitySelection from "./EntitySelection";
import CategorySelection from "./CategorySelection";
import StrategyField from "./strategy/StrategyField";
import InstrumentField from "./instrument/InstrumentField";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

const HedgeRequestForm: React.FC = () => {
  const { entities, isLoading } = useEntities();
  const { session } = useAuth();
  const [draftSaved, setDraftSaved] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      entity_name: "",
      cost_centre: "",
      country: "",
      geo_level_1: "",
      geo_level_2: "",
      geo_level_3: "",
      functional_currency: "",
      exposure_category_level_2: "",
      exposure_category_level_3: "",
      exposure_category_level_4: "",
      exposure_config: "",
      strategy: "",
      instrument: "",
    },
    mode: "onChange",
  });

  const handleEntitySelect = (field: "entity_id" | "entity_name", value: string) => {
    const selectedEntity = entities?.find(entity => 
      field === "entity_id" ? entity.entity_id === value : entity.entity_name === value
    );

    if (selectedEntity) {
      form.setValue("entity_id", selectedEntity.entity_id);
      form.setValue("entity_name", selectedEntity.entity_name);
      form.setValue("functional_currency", selectedEntity.functional_currency || "");
    }
  };

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  const handleSaveDraft = async () => {
    try {
      if (!session?.user) {
        toast.error("Please log in to save drafts");
        return;
      }

      const formData = form.getValues();
      console.log('Saving draft with data:', { ...formData, created_by: session.user.id });
      
      const { data: draftData, error: draftError } = await supabase
        .from('hedge_request_draft')
        .insert([
          {
            ...formData,
            created_by: session.user.id,
            status: 'DRAFT'
          }
        ])
        .select()
        .single();

      if (draftError) {
        console.error('Error saving draft:', draftError);
        toast.error("Failed to save draft");
        return;
      }

      setDraftSaved(true);
      toast.success("Draft saved successfully");
      console.log('Saved draft:', draftData);
    } catch (error) {
      console.error('Error in handleSaveDraft:', error);
      toast.error("Failed to save draft");
    }
  };

  // Check if all required fields are filled
  const isFormValid = form.formState.isValid;
  const isAuthenticated = !!session?.user;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-2 py-1">
            <EntitySelection 
              form={form}
              entities={entities}
              isLoading={isLoading}
              onEntitySelect={handleEntitySelect}
            />
          </div>
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-2 py-1">
            <CategorySelection 
              form={form}
              entityId={form.watch("entity_id")}
            />
            <StrategyField 
              form={form}
              disabled={!form.watch("exposure_category_level_2")}
            />
            <InstrumentField 
              form={form}
              disabled={!form.watch("strategy")}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 px-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleSaveDraft}
            disabled={!isAuthenticated || !isFormValid}
          >
            Save Draft
          </Button>
          <Button 
            type="submit"
            disabled={!draftSaved}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;