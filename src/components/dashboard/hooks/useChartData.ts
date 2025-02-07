
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChartData = () => {
  return useQuery({
    queryKey: ['hedge-request-drafts-by-entity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select('entity_name');

      if (error) {
        console.error('Error fetching hedge requests:', error);
        throw error;
      }

      const entityCounts = data.reduce((acc: { [key: string]: number }, curr) => {
        const entityName = curr.entity_name || 'Unspecified';
        acc[entityName] = (acc[entityName] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(entityCounts).map(([entity, count]) => ({
        entity,
        count
      }));
    }
  });
};
