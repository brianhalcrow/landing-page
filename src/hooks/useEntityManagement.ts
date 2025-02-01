import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEntityManagement = (entityId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .eq("entity_id", entityId)
        .single();

      if (error) {
        console.error("Error fetching entity:", error);
        toast.error("Failed to fetch entity data");
        throw error;
      }

      return data;
    },
    enabled: !!entityId,
  });

  return {
    entity: data,
    isLoading,
    error,
  };
};