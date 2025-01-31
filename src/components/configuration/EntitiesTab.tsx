import { supabase } from '@/integrations/supabase/client';
import EntitiesGrid from './EntitiesGrid';
import CsvOperations from './CsvOperations';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react';
import { toast } from "sonner";
import { useEntities } from '@/hooks/useEntities';
import { useQuery } from "@tanstack/react-query";

const EntitiesTab = () => {
  const { isLoading, error, refetch } = useEntities();

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

  // Handle auth state changes and real-time updates
  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        refetch();
      }
    });

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
          await refetch();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (error) {
    toast.error(`Error loading entities: ${error.message}`);
    return (
      <div className="p-4 space-y-4">
        <CsvOperations />
        <div className="text-red-500">
          Error loading entities. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <CsvOperations />
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <EntitiesGrid entities={exposures || []} />
      )}
    </div>
  );
};

export default EntitiesTab;