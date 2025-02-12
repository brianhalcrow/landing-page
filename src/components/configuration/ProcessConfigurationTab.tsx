
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProcessConfigurationGrid from "./grid/ProcessConfigurationGrid";

interface ProcessType {
  process_type_id: number;
  process_name: string;
  process_options: {
    process_option_id: number;
    option_name: string;
    process_settings: {
      process_setting_id: number;
      setting_name: string;
      setting_type: string;
      parent_setting_id: number | null;
    }[];
  }[];
}

interface Entity {
  entity_id: string;
  entity_name: string;
  settings: any[];
  schedules: any[];
  isEditing: boolean;
}

const ProcessConfigurationTab = () => {
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
              setting_type,
              parent_setting_id
            )
          )
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      return data as ProcessType[];
    }
  });

  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('client_legal_entity')
        .select('*')
        .eq('is_active', true);

      if (entitiesError) throw entitiesError;

      const { data: processSettingsData, error: settingsError } = await supabase
        .from('entity_process_settings')
        .select('*')
        .in('entity_id', entitiesData?.map(entity => entity.entity_id) || []);

      if (settingsError) throw settingsError;

      const { data: scheduleDefinitionsData, error: scheduleError } = await supabase
        .from('schedule_definitions')
        .select(`
          *,
          schedule_details (*),
          schedule_parameters (*)
        `)
        .in('entity_id', entitiesData?.map(entity => entity.entity_id) || []);

      if (scheduleError) throw scheduleError;

      return entitiesData?.map(entity => ({
        ...entity,
        settings: processSettingsData?.filter(setting => 
          setting.entity_id === entity.entity_id
        ) || [],
        schedules: scheduleDefinitionsData?.filter(schedule => 
          schedule.entity_id === entity.entity_id
        ) || [],
        isEditing: false
      })) as Entity[];
    },
    enabled: true
  });

  if (isLoadingTypes || isLoadingEntities) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!entities?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found.
      </div>
    );
  }

  if (!processTypes?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No process types configured.
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Process Configuration</h2>
        <ProcessConfigurationGrid 
          entities={entities}
          processTypes={processTypes}
        />
      </div>
    </Suspense>
  );
};

export default ProcessConfigurationTab;
