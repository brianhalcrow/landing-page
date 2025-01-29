import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEntityQuery = () => {
  const { 
    data: entities, 
    isLoading: isLoadingEntities,
    refetch: refetchEntities 
  } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_entity")
        .select("*");
      
      if (error) {
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      return data;
    },
  });

  return {
    entities,
    isLoadingEntities,
    refetchEntities
  };
};