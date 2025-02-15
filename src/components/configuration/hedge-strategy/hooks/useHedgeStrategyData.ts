
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HedgeStrategyGridRow } from '../types/hedgeStrategy.types';

export const useHedgeStrategyData = () => {
  const [rowData, setRowData] = useState<HedgeStrategyGridRow[]>([]);

  const { isLoading } = useQuery({
    queryKey: ['hedge-strategy-config'],
    queryFn: async () => {
      const { data: configurations, error } = await supabase
        .from('hedge_strategy')
        .select(`
          id,
          strategy_name,
          instrument
        `);

      if (error) {
        console.error('Error fetching configurations:', error);
        throw error;
      }

      console.log('Fetched configurations:', configurations);

      const gridRows: HedgeStrategyGridRow[] = configurations.map(config => ({
        entity_id: '',  // These will be populated when assigned to an entity
        entity_name: '',
        strategy_name: config.strategy_name,
        instrument: config.instrument,
        counterparty_id: '',
        counterparty_name: ''
      }));

      console.log('Generated grid rows:', gridRows);
      setRowData(gridRows);
      return gridRows;
    }
  });

  return { rowData, isLoading };
};
