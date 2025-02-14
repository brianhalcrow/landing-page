
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HedgeStrategyGridRow } from '../types/hedgeStrategy.types';

export const useHedgeStrategyData = () => {
  const [rowData, setRowData] = useState<HedgeStrategyGridRow[]>([]);

  const { isLoading } = useQuery({
    queryKey: ['hedge-strategy-assignments'],
    queryFn: async () => {
      console.log('Fetching hedge strategy assignments from view');
      
      const { data: configurations, error } = await supabase
        .from('v_valid_hedge_configurations')
        .select('*');

      if (error) {
        console.error('Error fetching configurations:', error);
        throw error;
      }

      console.log('Fetched configurations:', configurations);

      const gridRows: HedgeStrategyGridRow[] = configurations.map(config => ({
        entity_id: config.entity_id,
        entity_name: config.entity_name,
        exposure_category_l2: config.exposure_category_l2,
        strategy: config.strategy_id.toString(),
        strategy_name: config.strategy,
        strategy_description: config.strategy_description,
        instrument: config.instrument,
        counterparty_id: config.counterparty_id,
        counterparty_name: config.counterparty_name,
        isAssigned: config.is_assigned,
        assignmentId: config.assignment_id
      }));

      console.log('Generated grid rows:', gridRows);
      setRowData(gridRows);
      return gridRows;
    }
  });

  return { rowData, isLoading };
};
