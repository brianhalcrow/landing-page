import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDraftSelection = (form: UseFormReturn<FormValues>) => {
  const handleDraftSelect = async (selectedDraftId: string) => {
    try {
      console.log('Fetching draft data for ID:', selectedDraftId);
      
      // Temporarily disable form validation
      form.clearErrors();
      
      const { data, error } = await supabase.functions.invoke('get-draft-data', {
        body: JSON.stringify({ draft_id: selectedDraftId })
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

      // Reset form before setting new values
      form.reset();

      const draft = data.draft;
      console.log('Loaded draft data:', draft);

      // Create a complete form state object
      const formState = {
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
      };

      // Set all values at once using reset
      form.reset(formState, {
        keepDefaultValues: false
      });

      console.log('Draft loaded successfully:', data);
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