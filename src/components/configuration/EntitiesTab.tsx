import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EntitiesGrid from './EntitiesGrid';
import CsvOperations from './CsvOperations';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react';
import { toast } from "sonner";

const EntitiesTab = () => {
  const { data: entities, isLoading, error, refetch } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pre_trade_sfx_config_exposures')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No entities found');
      }
      
      return data as Tables<'pre_trade_sfx_config_exposures'>[];
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
        <EntitiesGrid entities={entities || []} onRefresh={refetch} />
      )}
    </div>
  );
};

export default EntitiesTab;