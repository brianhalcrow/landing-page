
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Strategy {
  strategy_id: string;
  strategy_name: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  instrument: string;
}

export const useStrategies = (entityId: string, exposureCategoryL3?: string) => {
  return useQuery({
    queryKey: ['hedge-strategies', entityId, exposureCategoryL3],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_valid_entity_strategies')
        .select('*')
        .eq('entity_id', entityId)
        .eq('exposure_category_l3', exposureCategoryL3 || '')
        .order('strategy_name');
      
      if (error) throw error;
      return data as Strategy[];
    },
    enabled: !!entityId && !!exposureCategoryL3
  });
};
