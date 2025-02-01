import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDraftSelection = (form: UseFormReturn<FormValues>) => {
  const handleDraftSelect = async (selectedDraftId: string) => {
    try {
      if (!selectedDraftId) {
        console.error('No draft ID provided');
        toast.error("No draft selected");
        return null;
      }

      console.log('Fetching draft data for ID:', selectedDraftId);
      
      const { data, error } = await supabase.functions.invoke('get-draft-data', {
        body: { draft_id: selectedDraftId }
      });

      if (error) {
        console.error('Error fetching draft:', error);
        toast.error("Failed to load draft");
        return null;
      }

      if (!data || !data.draft) {
        console.error('No draft data found:', data);
        toast.error("No draft data found");
        return null;
      }

      const draft = data.draft;
      console.log('Loading draft data:', draft);

      // Reset form with all values at once, bypassing validation
      form.reset({
        entity_id: draft.entity_id || '',
        entity_name: draft.entity_name || '',
        functional_currency: draft.functional_currency || '',
        exposure_config: draft.exposure_config || '',
        exposure_category_level_2: draft.exposure_category_level_2 || '',
        exposure_category_level_3: draft.exposure_category_level_3 || '',
        exposure_category_level_4: draft.exposure_category_level_4 || '',
        strategy: draft.strategy || '',
        instrument: draft.instrument || '',
        cost_centre: draft.cost_centre || '',
        country: draft.country || '',
        geo_level_1: draft.geo_level_1|| '',
        geo_level_2: draft.geo_level_2 || '',
        geo_level_3: draft.geo_level_3 || ''
      }, {
        keepDirty: false,
        keepTouched: true,
        keepIsValid: true,
        keepErrors: false,
        keepValues: true,
        keepDefaultValues: false,
      });

      // Force update specific fields to trigger UI updates
      const fieldsToForceUpdate = [
        'exposure_config',
        'exposure_category_level_2',
        'exposure_category_level_3',
        'exposure_category_level_4',
        'strategy',
        'cost_centre'
      ];

      fieldsToForceUpdate.forEach(field => {
        const value = draft[field] || '';
        form.setValue(field, value, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false
        });
      });

      console.log('Draft loaded successfully:', draft);
      toast.success("Draft loaded successfully");
      return data;
    } catch (error) {
      console.error('Error in handleDraftSelect:', error);
      toast.error("Failed to load draft");
      return null;
    }
  };

  return { handleDraftSelect };
};