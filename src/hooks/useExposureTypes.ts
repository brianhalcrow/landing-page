import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExposureType {
  exposure_type_id: number;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  subsystem: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useExposureTypes = () => {
  return useQuery<ExposureType[]>({
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