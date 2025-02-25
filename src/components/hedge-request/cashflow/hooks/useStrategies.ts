
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Strategy {
  strategy_id: number;
  strategy_name: string;
  instrument: string;
}

export const useStrategies = (entityId: string, exposureCategoryL2: string) => {
  return useQuery({
    queryKey: ['hedge-strategies', entityId, exposureCategoryL2],
    queryFn: async () => {
      if (!entityId || !exposureCategoryL2) return null;
      
      const { data, error } = await supabase
        .from('hedge_strategy')
        .select('strategy_id, strategy_name, instrument')
        .eq('exposure_category_l2', exposureCategoryL2);
      
      if (error) throw error;
      return data as Strategy[];
    },
    enabled: !!entityId && !!exposureCategoryL2
  });
};
