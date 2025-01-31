import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EntitiesGrid from "./EntitiesGrid";
import { useEntities } from "@/hooks/useEntities";

const EntitiesTab = () => {
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

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        refetch();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading entities: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exposures && <EntitiesGrid entities={exposures} />}
    </div>
  );
};

export default EntitiesTab;