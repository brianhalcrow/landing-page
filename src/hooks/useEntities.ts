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
      console.log('Fetching entities...');
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .select("*")
        .order('entity_name');
      
      if (error) {
        console.error('Error fetching entities:', error);
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      console.log('Entities fetched:', data);
      return data as Tables<'pre_trade_sfx_config_exposures'>[];
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });

  return {
    entities,
    isLoading,
    error,
    refetch
  };
};