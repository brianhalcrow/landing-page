import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExposureTypes = () => {
  return useQuery({
    queryKey: ['exposure-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exposure_types')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });
};