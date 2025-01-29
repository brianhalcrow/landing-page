import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EntitiesGrid from './EntitiesGrid';
import CsvOperations from './CsvOperations';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from "@/components/ui/skeleton";

const EntitiesTab = () => {
  const { data: entities, isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pre_trade_sfx_config_entity')
        .select('*');
      
      if (error) throw error;
      return data as Tables<'pre_trade_sfx_config_entity'>[];
    },
  });

  if (error) {
    return <div className="p-4 text-red-500">Error loading entities: {error.message}</div>;
  }

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full m-4" />;
  }

  return (
    <div className="space-y-4 p-4">
      <CsvOperations />
      <EntitiesGrid entities={entities || []} />
    </div>
  );
};

export default EntitiesTab;