
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';
import { HedgeRequestDraft, ValidEntity } from './types';
import DraftDataGrid from './components/DraftDataGrid';

const CACHE_KEY = 'hedge-request-draft-grid-state';

const InputDraftGrid = () => {
  const queryClient = useQueryClient();
  
  const emptyRow: HedgeRequestDraft = {
    id: 0,
    entity_id: null,
    entity_name: null,
    functional_currency: null,
    cost_centre: null,
    exposure_category_l1: null,
    exposure_category_l2: null,
    exposure_category_l3: null,
    strategy_description: null,
    instrument: null,
    status: 'DRAFT',
    created_by: null,
    created_at: null,
    updated_at: null
  };
  
  const cachedState = queryClient.getQueryData<HedgeRequestDraft[]>([CACHE_KEY]) || [emptyRow];
  const [rowData, setRowData] = useState<HedgeRequestDraft[]>(cachedState);

  const updateCache = useCallback((newData: HedgeRequestDraft[]) => {
    queryClient.setQueryData([CACHE_KEY], newData);
    setRowData(newData);
  }, [queryClient]);

  const { data: validEntities } = useQuery({
    queryKey: ['valid-entities'],
    queryFn: async () => {
      console.log('Fetching valid entities...');
      
      const { data: configuredEntities, error: configError } = await supabase
        .from('client_legal_entity')
        .select('entity_id, entity_name, functional_currency');

      if (configError) {
        console.error('Error fetching configured entities:', configError);
        throw configError;
      }

      if (!configuredEntities?.length) {
        console.log('No configured entities found');
        return [];
      }

      const transformedEntities = configuredEntities.map(entity => ({
        entity_id: entity.entity_id,
        entity_name: entity.entity_name,
        functional_currency: entity.functional_currency
      }));

      console.log('Fetched valid entities:', transformedEntities);
      return transformedEntities as ValidEntity[];
    }
  });

  return (
    <div className="space-y-4">
      <DraftDataGrid 
        rowData={rowData}
        onRowDataChange={updateCache}
      />
    </div>
  );
};

export default InputDraftGrid;
