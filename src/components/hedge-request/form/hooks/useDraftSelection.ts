import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDraftSelection = (form: UseFormReturn<FormValues>) => {
  const handleDraftSelect = async (selectedDraftId: string) => {
    try {
      console.log('Fetching draft data for ID:', selectedDraftId);
      
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

      // Set entity-related fields first and wait for them to be set
      await Promise.all([
        form.setValue('entity_id', draft.entity_id || ''),
        form.setValue('entity_name', draft.entity_name || ''),
        form.setValue('functional_currency', draft.functional_currency || '')
      ]);

      // Wait a moment for entity fields to be processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set exposure config (L1) and wait
      if (draft.exposure_config) {
        await form.setValue('exposure_config', draft.exposure_config);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Set L2 and wait
        if (draft.exposure_category_level_2) {
          await form.setValue('exposure_category_level_2', draft.exposure_category_level_2);
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Set L3 and wait
          if (draft.exposure_category_level_3) {
            await form.setValue('exposure_category_level_3', draft.exposure_category_level_3);
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Set L4 and wait
            if (draft.exposure_category_level_4) {
              await form.setValue('exposure_category_level_4', draft.exposure_category_level_4);
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Finally set strategy and instrument
              if (draft.strategy) {
                await form.setValue('strategy', draft.strategy);
                await new Promise(resolve => setTimeout(resolve, 200));
                
                if (draft.instrument) {
                  await form.setValue('instrument', draft.instrument);
                }
              }
            }
          }
        }
      }

      // Set remaining fields that don't have dependencies
      form.setValue('cost_centre', draft.cost_centre || '');
      form.setValue('country', draft.country || '');
      form.setValue('geo_level_1', draft.geo_level_1 || '');
      form.setValue('geo_level_2', draft.geo_level_2 || '');
      form.setValue('geo_level_3', draft.geo_level_3 || '');

      console.log('Draft loaded successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in handleDraftSelect:', error);
      toast.error("Failed to load draft");
      return null;
    }
  };

  return { handleDraftSelect };
};