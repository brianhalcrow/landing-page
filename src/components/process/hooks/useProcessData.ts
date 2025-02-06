
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProcessData = () => {
  // Fetch process types
  const { data: processTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['process-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_types')
        .select(`
          process_type_id,
          process_name,
          process_options (
            process_option_id,
            option_name,
            process_settings (
              process_setting_id,
              setting_name,
              setting_type
            )
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Fetch entity settings
  const { data: entitySettings, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entity-process-settings'],
    queryFn: async () => {
      const { data: entities, error: entitiesError } = await supabase
        .from('entity_exposure_config')
        .select(`
          entity_id,
          entities (
            entity_name
          )
        `)
        .eq('exposure_type_id', 4)
        .eq('is_active', true);

      if (entitiesError) throw entitiesError;

      const { data: settings, error: settingsError } = await supabase
        .from('entity_process_settings')
        .select('*')
        .in('entity_id', entities?.map(e => e.entity_id) || []);

      if (settingsError) throw settingsError;

      return entities?.map(entity => {
        const entitySettings = settings?.filter(s => s.entity_id === entity.entity_id) || [];
        
        const settingsMap = Object.fromEntries(
          (processTypes || []).flatMap(pt => 
            pt.process_options.flatMap(po => 
              po.process_settings.map(ps => [
                `setting_${ps.process_setting_id}`,
                entitySettings.find(es => es.process_setting_id === ps.process_setting_id)?.setting_value === 'true'
              ])
            )
          )
        );

        return {
          entity_id: entity.entity_id,
          entity_name: entity.entities?.entity_name,
          ...settingsMap,
          isEditing: false
        };
      });
    },
    enabled: !!processTypes
  });

  return {
    processTypes,
    entitySettings,
    isLoading: isLoadingTypes || isLoadingEntities
  };
};
