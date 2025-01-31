import { useEffect } from "react";
import ConfigurationForm from "./form/ConfigurationForm";
import ConfigurationGrid from "./ConfigurationGrid";
import { useEntities } from "@/hooks/useEntities";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const GeneralTab = () => {
  const { entities: allEntities, isLoading, refetch } = useEntities();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'config_exposures'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          console.log("Event type:", payload.eventType);
          console.log("Full payload:", JSON.stringify(payload, null, 2));
          // Invalidate and refetch the exposures query
          await queryClient.invalidateQueries({ queryKey: ["exposures"] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription...");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Fetch existing exposure configurations
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

  return (
    <div className="p-6 space-y-8">
      <ConfigurationForm entities={allEntities || []} />
      <ConfigurationGrid entities={exposures || []} />
    </div>
  );
};

export default GeneralTab;