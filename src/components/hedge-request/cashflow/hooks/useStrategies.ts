
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Strategy {
  strategy_id: string;
  strategy_name: string;
  exposure_category_l2: string;
  instrument: string;
}

export const useStrategies = (entityId: string, exposureCategoryL2?: string) => {
  return useQuery({
    queryKey: ['hedge-strategies', entityId, exposureCategoryL2],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_strategy')
        .select('id as strategy_id, strategy_name, exposure_category_l2, instrument')
        .eq('exposure_category_l2', exposureCategoryL2 || '')
        .order('strategy_name');
      
      if (error) throw error;
      return data as Strategy[];
    },
    enabled: !!entityId && !!exposureCategoryL2
  });
};
