
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
        .from('v_hedge_request_config')
        .select(`
          entity_id,
          entity_name,
          strategy_id,
          strategy,
          strategy_description,
          instrument,
          counterparty_id,
          counterparty_name,
          hedge_strategy_assignment:hedge_strategy_assignment(id)
        `);

      if (error) {
        console.error('Error fetching configurations:', error);
        throw error;
      }

      console.log('Fetched configurations:', configurations);

      const gridRows: HedgeStrategyGridRow[] = configurations.map(config => ({
        entity_id: config.entity_id,
        entity_name: config.entity_name,
        strategy: config.strategy_id.toString(),
        strategy_name: config.strategy,
        strategy_description: config.strategy_description,
        instrument: config.instrument,
        counterparty_id: config.counterparty_id,
        counterparty_name: config.counterparty_name,
        isAssigned: config.hedge_strategy_assignment?.length > 0,
        assignmentId: config.hedge_strategy_assignment?.[0]?.id
      }));

      console.log('Generated grid rows:', gridRows);
      setRowData(gridRows);
      return gridRows;
    }
  });

  return { rowData, isLoading };
};
