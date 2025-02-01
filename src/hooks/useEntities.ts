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
      console.log('Fetching entities from entities table...');
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order('entity_name');
      
      if (error) {
        console.error('Error fetching entities:', error);
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      console.log('Entities fetched:', data);
      return data;
    },
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  return {
    entities,
    isLoading,
    error,
    refetch
  };
};