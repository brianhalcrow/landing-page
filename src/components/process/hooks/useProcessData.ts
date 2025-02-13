
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProcessType {
  process_type_id: number;
  process_name: string;
  process_options: ProcessOption[];
}

interface ProcessOption {
  process_option_id: number;
  option_name: string;
  process_settings: ProcessSetting[];
}

interface ProcessSetting {
  process_setting_id: number;
  setting_name: string;
  setting_type: string;
}

interface EntitySetting {
  entity_id: string;
  entity_name: string;
  settings: any[];
  isEditing: boolean;
}

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
      return data as ProcessType[];
    },
  });

  // Fetch entity settings
  const { data: entitySettings, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entity-process-settings'],
    queryFn: async () => {
      const { data: entities, error: entitiesError } = await supabase
        .from('entities')
        .select('entity_id, entity_name');

      if (entitiesError) throw entitiesError;

      const { data: settings, error: settingsError } = await supabase
        .from('entity_process_settings')
        .select('*')
        .in('entity_id', entities?.map(e => e.entity_id) || []);

      if (settingsError) throw settingsError;

      return entities?.map(entity => ({
        entity_id: entity.entity_id,
        entity_name: entity.entity_name,
        settings: settings?.filter(s => s.entity_id === entity.entity_id) || [],
        isEditing: false
      })) as EntitySetting[];
    },
    enabled: !!processTypes
  });

  return {
    processTypes,
    entitySettings,
    isLoading: isLoadingTypes || isLoadingEntities
  };
};
