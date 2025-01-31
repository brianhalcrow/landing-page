import { useEntities } from "@/hooks/useEntities";
import { Skeleton } from "@/components/ui/skeleton";
import ConfigurationGrid from "./ConfigurationGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IntegrationsTab = () => {
  const { isLoading, error } = useEntities();

  const { data: exposures } = useQuery({
    queryKey: ["exposures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_exposures")
        .select("*")
        .order('entity_name');
      
      if (error) {
        toast.error('Failed to fetch exposure configurations');
        throw error;
      }
      
      return data;
    },
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading entities. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <ConfigurationGrid entities={exposures || []} />
      )}
    </div>
  );
};

export default IntegrationsTab;