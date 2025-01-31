import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDraftSelection = (form: UseFormReturn<FormValues>) => {
  const handleDraftSelect = async (selectedDraftId: string) => {
    try {
      // Fetch draft data
      const { data: draftData, error } = await supabase
        .from('hedge_request_draft')
        .select('*')
        .eq('id', selectedDraftId)
        .single();

      if (error || !draftData) {
        toast.error("Failed to load draft");
        return;
      }

      // Reset form before setting new values
      form.reset();

      // Set entity-related fields first
      form.setValue('entity_id', draftData.entity_id || '');
      form.setValue('entity_name', draftData.entity_name || '');
      form.setValue('functional_currency', draftData.functional_currency || '');

      // Wait for a short moment to ensure entity fields are processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set exposure fields
      if (draftData.exposure_config) {
        form.setValue('exposure_config', draftData.exposure_config);
        
        // Wait for criteria data to be loaded
        await new Promise(resolve => setTimeout(resolve, 200));

        if (draftData.exposure_category_level_2) {
          form.setValue('exposure_category_level_2', draftData.exposure_category_level_2);
          
          // Wait for L2 effects
          await new Promise(resolve => setTimeout(resolve, 200));

          if (draftData.exposure_category_level_3) {
            form.setValue('exposure_category_level_3', draftData.exposure_category_level_3);
            
            // Wait for L3 effects
            await new Promise(resolve => setTimeout(resolve, 200));

            if (draftData.exposure_category_level_4) {
              form.setValue('exposure_category_level_4', draftData.exposure_category_level_4);
              
              // Wait for L4 effects
              await new Promise(resolve => setTimeout(resolve, 200));

              if (draftData.strategy) {
                form.setValue('strategy', draftData.strategy);
                
                // Wait for strategy effects
                await new Promise(resolve => setTimeout(resolve, 200));

                if (draftData.instrument) {
                  form.setValue('instrument', draftData.instrument);
                }
              }
            }
          }
        }
      }

      return draftData;
    } catch (error) {
      console.error('Error in handleDraftSelect:', error);
      toast.error("Failed to load draft");
    }
  };

  return { handleDraftSelect };
};