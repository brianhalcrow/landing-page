import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EntitiesGrid from "./EntitiesGrid";
import { useEntities } from "@/hooks/useEntities";

const EntitiesTab = () => {
  const { isLoading, error, refetch } = useEntities();

  const { data: entities } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order('entity_name');

      if (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to fetch entities");
        throw error;
      }

      return data;
    },
  });

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading entities: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entities && <EntitiesGrid entities={entities} />}
    </div>
  );
};

export default EntitiesTab;