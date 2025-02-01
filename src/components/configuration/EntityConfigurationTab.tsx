import { useEffect } from "react";
import ConfigurationForm from "./form/ConfigurationForm";
import ConfigurationGrid from "./ConfigurationGrid";
import { useEntities } from "@/hooks/useEntities";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Entity } from "./types";

const EntityConfigurationTab = () => {
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
          table: 'entities'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          console.log("Event type:", payload.eventType);
          console.log("Full payload:", JSON.stringify(payload, null, 2));
          await queryClient.invalidateQueries({ queryKey: ["entities"] });
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

  const { data: entities } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order('entity_name');
      
      if (error) {
        toast.error('Failed to fetch entities');
        throw error;
      }
      
      return data as Entity[];
    },
  });

  return (
    <div className="p-6 space-y-8">
      <ConfigurationForm entities={allEntities || []} />
      <ConfigurationGrid entities={entities || []} />
    </div>
  );
};

export default EntityConfigurationTab;