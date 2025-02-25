
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExposureConfig {
  entity_id: string;
  exposure_type_id: number;
  exposure_types: {
    exposure_category_l1: string;
    exposure_category_l2: string;
    exposure_category_l3: string;
    subsystem: string;
  };
}

export const useExposureConfig = (entityId: string) => {
  return useQuery({
    queryKey: ['entity-exposure-config', entityId],
    queryFn: async () => {
      if (!entityId) return null;
      
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          entity_id,
          exposure_type_id,
          exposure_types (
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3,
            subsystem
          )
        `)
        .eq('entity_id', entityId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data as ExposureConfig[];
    },
    enabled: !!entityId
  });
};
