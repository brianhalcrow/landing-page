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
import TradesGrid from "./trades/TradesGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDraftSelection } from "./hooks/useDraftSelection";

const HedgeRequestForm: React.FC = () => {
  const { entities, isLoading } = useEntities();
  const { session } = useAuth();
  const [draftSaved, setDraftSaved] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
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

  const { handleDraftSelect } = useDraftSelection(form);

  useEffect(() => {
    const fetchDrafts = async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch drafts");
        return;
      }

      setDrafts(data || []);
    };

    fetchDrafts();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const values = form.getValues();
      const requiredFields = [
        "entity_id",
        "entity_name",
        "cost_centre",
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

  const onDraftSelect = async (selectedDraftId: string) => {
    setDraftId(selectedDraftId);
    const draftData = await handleDraftSelect(selectedDraftId);
    if (draftData) {
      setDraftSaved(true);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    if (!draftSaved) {
      toast.error("Please save a draft first");
      return;
    }
    console.log('Submitting form with data:', data);
    // Add your submit logic here
  };

  const handleSaveDraft = async () => {
    console.log('Save Draft Button Clicked', {
      isFormComplete,
      formValues: form.getValues(),
      formState: form.formState
    });

    try {
      const userId = session?.user?.id || 'mock-user-id';

      const formData = form.getValues();
      
      const { data: draftData, error: draftError } = await supabase
        .from('hedge_request_draft')
        .insert([
          {
            ...formData,
            created_by: userId,
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
        setDraftId(draftData.id);
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

  const canSaveDraft = isFormComplete && !draftSaved;
  const canSubmit = isFormComplete && draftSaved;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="w-80 mb-4">
          <Select onValueChange={onDraftSelect} value={draftId || ""}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Select a draft" />
            </SelectTrigger>
            <SelectContent>
              {drafts.map((draft) => (
                <SelectItem key={draft.id} value={draft.id}>
                  {`${draft.entity_name || 'Unnamed'} - ${new Date(draft.created_at).toLocaleDateString()}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-2 py-1">
            <EntitySelection 
              form={form}
              entities={entities}
              isLoading={isLoading}
              onEntitySelect={(field, value) => {
                const selectedEntity = entities?.find(entity => 
                  field === "entity_id" ? entity.entity_id === value : entity.entity_name === value
                );

                if (selectedEntity) {
                  form.setValue("entity_id", selectedEntity.entity_id);
                  form.setValue("entity_name", selectedEntity.entity_name);
                  form.setValue("functional_currency", selectedEntity.functional_currency || "");
                }
              }}
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
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-4 px-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSaveDraft}
              disabled={!canSaveDraft}
            >
              Save Draft
            </Button>
            <Button 
              type="submit"
              disabled={!canSubmit}
            >
              Submit {!draftSaved && "(Save draft first)"}
            </Button>
          </div>
          {isFormComplete && !draftSaved && (
            <p className="text-sm text-gray-500 text-right px-2">
              Form is complete. Click Save Draft to proceed.
            </p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Trade Details</h3>
          <TradesGrid draftId={draftId} />
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;