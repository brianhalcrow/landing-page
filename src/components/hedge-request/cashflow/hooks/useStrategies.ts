
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Strategy {
  strategy_id: string;
  strategy_name: string;
  exposure_category_l2: string;
  instrument: string;
}

export const useStrategies = () => {
  return useQuery({
    queryKey: ['hedge-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_strategy')
        .select('*');
      
      if (error) throw error;
      return data as Strategy[];
    }
  });
};
