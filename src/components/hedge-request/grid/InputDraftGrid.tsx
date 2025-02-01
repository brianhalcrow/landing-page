import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { HedgeRequestDraft, ValidEntity } from './types';
import DraftDataGrid from './components/DraftDataGrid';
import GridActions from './components/GridActions';

const CACHE_KEY = 'hedge-request-draft-grid-state';

const InputDraftGrid = () => {
  const queryClient = useQueryClient();
  
  const emptyRow = {
    entity_id: '',
    entity_name: '',
    functional_currency: '',
    cost_centre: '',
    exposure_category_l1: '',
    exposure_category_l2: '',
    exposure_category_l3: '',
    strategy_description: '',
    instrument: ''
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
        .from('entity_exposure_config')
        .select(`
          entity_id,
          entities!inner (
            entity_id,
            entity_name,
            functional_currency
          )
        `)
        .eq('is_active', true);

      if (configError) {
        console.error('Error fetching configured entities:', configError);
        toast.error('Failed to fetch configured entities');
        throw configError;
      }

      if (!configuredEntities?.length) {
        console.log('No configured entities found');
        return [];
      }

      const uniqueEntities = Array.from(
        new Map(
          configuredEntities.map(item => [
            item.entities.entity_id,
            {
              entity_id: item.entities.entity_id,
              entity_name: item.entities.entity_name,
              functional_currency: item.entities.functional_currency
            }
          ])
        ).values()
      );

      console.log('Fetched valid entities:', uniqueEntities);
      return uniqueEntities as ValidEntity[];
    }
  });

  const handleSaveDraft = async () => {
    try {
      const invalidEntities = rowData.filter(row => 
        !validEntities?.some(valid => valid.entity_id === row.entity_id)
      );

      if (invalidEntities.length > 0) {
        toast.error('Some entities are not properly configured. Please select valid entities.');
        return;
      }

      // Remove id from each row before inserting
      const dataToInsert = rowData.map(({ id, ...rest }) => rest);

      const { error } = await supabase
        .from('hedge_request_draft')
        .insert(dataToInsert)
        .select();

      if (error) throw error;

      toast.success('Draft saved successfully');
      updateCache([emptyRow]);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const addNewRow = useCallback(() => {
    const newData = [...rowData, emptyRow];
    updateCache(newData);
  }, [rowData, updateCache]);

  return (
    <div className="space-y-4">
      <DraftDataGrid 
        rowData={rowData}
        onRowDataChange={updateCache}
      />
      <GridActions 
        onAddRow={addNewRow}
        onSaveDraft={handleSaveDraft}
        isDisabled={!validEntities?.length}
      />
    </div>
  );
};

export default InputDraftGrid;