import IntegrationsGrid from "./IntegrationsGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEntities } from "@/hooks/useEntities";

const IntegrationsTab = () => {
  const { isLoading, error, refetch } = useEntities();

  const { data: exposures } = useQuery({
    queryKey: ["exposures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_exposures")
        .select("*");

      if (error) {
        console.error("Error fetching exposures:", error);
        toast.error("Failed to fetch exposures");
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
      {exposures && <IntegrationsGrid entities={exposures} />}
    </div>
  );
};

export default IntegrationsTab;