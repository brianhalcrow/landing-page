import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDraftSelection = (form: UseFormReturn<FormValues>) => {
  const handleDraftSelect = async (selectedDraftId: string) => {
    try {
      console.log('Fetching draft data for ID:', selectedDraftId);
      
      // Call the edge function with properly formatted body
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

      // Set entity-related fields first
      form.setValue('entity_id', draft.entity_id || '');
      form.setValue('entity_name', draft.entity_name || '');
      form.setValue('functional_currency', draft.functional_currency || '');

      // Wait for a short moment to ensure entity fields are processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set exposure fields
      if (draft.exposure_config) {
        form.setValue('exposure_config', draft.exposure_config);
        
        // Wait for criteria data to be loaded
        await new Promise(resolve => setTimeout(resolve, 200));

        if (draft.exposure_category_level_2) {
          form.setValue('exposure_category_level_2', draft.exposure_category_level_2);
          
          // Wait for L2 effects
          await new Promise(resolve => setTimeout(resolve, 200));

          if (draft.exposure_category_level_3) {
            form.setValue('exposure_category_level_3', draft.exposure_category_level_3);
            
            // Wait for L3 effects
            await new Promise(resolve => setTimeout(resolve, 200));

            if (draft.exposure_category_level_4) {
              form.setValue('exposure_category_level_4', draft.exposure_category_level_4);
              
              // Wait for L4 effects
              await new Promise(resolve => setTimeout(resolve, 200));

              if (draft.strategy) {
                form.setValue('strategy', draft.strategy);
                
                // Wait for strategy effects
                await new Promise(resolve => setTimeout(resolve, 200));

                if (draft.instrument) {
                  form.setValue('instrument', draft.instrument);
                }
              }
            }
          }
        }
      }

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