
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEntityConfig = (entityId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .eq("entity_id", entityId)
        .single();

      if (error) {
        console.error("Error fetching entity:", error);
        toast.error("Failed to fetch entity configuration");
        throw error;
      }

      return data;
    },
    enabled: !!entityId,
  });

  return {
    entityConfig: data,
    isLoading,
    error,
  };
};
