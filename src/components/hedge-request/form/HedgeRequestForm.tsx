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
import { useState, useEffect } from "react";

const HedgeRequestForm: React.FC = () => {
  const { entities, isLoading } = useEntities();
  const { session } = useAuth();
  const [draftSaved, setDraftSaved] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all", // Changed from onChange to ensure more reliable validation
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
  });

  // Watch all form fields to check completion
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const values = form.getValues();
      const requiredFields = [
        "entity_id",
        "entity_name",
        "exposure_category_level_2",
        "exposure_category_level_3",
        "exposure_category_level_4",
        "exposure_config",
        "strategy"
      ];
      
      const isComplete = requiredFields.every(field => {
        const fieldValue = values[field];
        return fieldValue && fieldValue.length > 0;
      });
      
      console.log('Form completion check:', {
        values,
        isComplete,
        formState: form.formState
      });
      
      setIsFormComplete(isComplete);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

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

  const handleSubmit = async (data: FormValues) => {
    if (!draftSaved) {
      toast.error("Please save a draft first");
      return;
    }
    console.log(data);
    // Add your submit logic here
  };

  // Add debugging for button click
  const handleSaveDraft = async () => {
    console.log('Save Draft Button Clicked', {
      isFormComplete,
      isAuthenticated,
      draftSaved,
      canSaveDraft: isFormComplete && isAuthenticated && !draftSaved,
      formValues: form.getValues()
    });
    try {
      if (!session?.user) {
        toast.error("Please log in to save drafts");
        return;
      }

      const formData = form.getValues();
      
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
        setDraftSaved(false);
        return;
      }

      if (draftData) {
        setDraftSaved(true);
        toast.success("Draft saved successfully");
        console.log('Saved draft:', draftData);
      }
    } catch (error) {
      console.error('Error in handleSaveDraft:', error);
      toast.error("Failed to save draft");
      setDraftSaved(false);
    }
  };

  const isAuthenticated = !!session?.user;
  // Move canSaveDraft inside useEffect to ensure it updates with state changes
  useEffect(() => {
    const currentValues = form.getValues();
    const requiredFieldValues = {
      entity_id: currentValues.entity_id,
      entity_name: currentValues.entity_name,
      exposure_category_level_2: currentValues.exposure_category_level_2,
      exposure_category_level_3: currentValues.exposure_category_level_3,
      exposure_category_level_4: currentValues.exposure_category_level_4,
      exposure_config: currentValues.exposure_config,
      strategy: currentValues.strategy
    };
    
    console.log('Form State Debug:', {
      currentValues: requiredFieldValues,
      isFormComplete,
      isAuthenticated,
      draftSaved,
      formState: form.formState,
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid
    });
  }, [form, isFormComplete, isAuthenticated, draftSaved]);

  const canSaveDraft = isFormComplete && isAuthenticated && !draftSaved;
  const canSubmit = draftSaved && isFormComplete;

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
            disabled={!canSaveDraft}
            className={`${!canSaveDraft ? 'opacity-50' : ''}`}
          >
            Save Draft {!isFormComplete ? "(Complete all fields)" : 
                      !isAuthenticated ? "(Please log in)" : 
                      draftSaved ? "(Already saved)" : ""}
          </Button>
          <Button 
            type="submit"
            disabled={!canSubmit}
          >
            Submit {!draftSaved && "(Save draft first)"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;
