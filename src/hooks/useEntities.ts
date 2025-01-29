import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from '@/integrations/supabase/types';

export const useEntities = () => {
  const { 
    data: entities, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .select("*")
        .order('entity_name');
      
      if (error) {
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No entities found');
      }
      
      return data as Tables<'pre_trade_sfx_config_exposures'>[];
    },
    refetchOnWindowFocus: false,
  });

  return {
    entities,
    isLoading,
    error,
    refetch
  };
};