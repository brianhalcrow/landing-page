import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EntitiesGrid from './EntitiesGrid';
import CsvOperations from './CsvOperations';
import { Tables } from '@/integrations/supabase/types';

const EntitiesTab = () => {
  const { data: entities, isLoading } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pre_trade_sfx_config_entity')
        .select('*');
      
      if (error) throw error;
      return data as Tables<'pre_trade_sfx_config_entity'>[];
    },
  });

  if (isLoading) {
    return <div>Loading entities...</div>;
  }

  return (
    <div className="space-y-4">
      <CsvOperations />
      <EntitiesGrid entities={entities || []} />
    </div>
  );
};

export default EntitiesTab;