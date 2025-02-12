
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProcessConfigurationGrid from "./grid/ProcessConfigurationGrid";

// Database response types (matching Supabase schema)
interface DbProcessSetting {
  process_setting_id: number;
  setting_name: string;
  setting_type: string;
  parent_setting_id: number | null;
}

interface DbProcessOption {
  process_option_id: number;
  option_name: string;
  process_settings: DbProcessSetting[];
}

interface DbProcessType {
  process_type_id: number;
  process_name: string;
  process_options: DbProcessOption[];
}

interface DbScheduleParameter {
  parameter_name: string;
  parameter_value: string;
  schedule_id: number;
  created_at: string | null;
  updated_at: string | null;
  is_active: boolean | null;
}

interface DbScheduleDetail {
  day_of_month: number[] | null;
  day_of_week: number[] | null;
  execution_time: string[];
  frequency: "daily" | "weekly" | "monthly" | "on_demand";
  is_active: boolean | null;
  schedule_id: number;
  timezone: string;
  created_at: string | null;
  updated_at: string | null;
}

interface DbScheduleDefinition {
  schedule_id: number;
  entity_id: string;
  schedule_name: string;
  description: string | null;
  schedule_type: "on_demand" | "scheduled";
  process_option_id: number | null;
  process_setting_id: number;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  schedule_details: DbScheduleDetail;
  schedule_parameters: DbScheduleParameter[];
}

interface DbEntityProcessSetting {
  process_setting_id: number;
  entity_id: string;
  setting_value: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DbEntity {
  entity_id: string;
  entity_name: string | null;
  local_currency: string | null;
  functional_currency: string | null;
  accounting_rate_method: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

// Application types (for component usage)
interface EntityProcessSetting {
  setting_id: number;
  entity_id: string;
  setting_value: string;
  is_active: boolean;
}

interface Entity {
  entity_id: string;
  entity_name: string;
  settings: EntityProcessSetting[];
  schedules: DbScheduleDefinition[];
  isEditing: boolean;
}

const ProcessConfigurationTab = () => {
  const { data: processTypes, isLoading: isLoadingTypes } = useQuery<DbProcessType[]>({
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
      return data;
    }
  });

  const { data: entities, isLoading: isLoadingEntities } = useQuery<Entity[]>({
    queryKey: ['entities'],
    queryFn: async () => {
      // Fetch entities
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('client_legal_entity')
        .select('*')
        .eq('is_active', true);
      if (entitiesError) throw entitiesError;

      // Fetch settings
      const { data: processSettingsData, error: settingsError } = await supabase
        .from('entity_process_settings')
        .select('*')
        .in('entity_id', (entitiesData || []).map(entity => entity.entity_id));
      if (settingsError) throw settingsError;

      // Fetch schedule definitions
      const { data: scheduleDefinitionsData, error: scheduleError } = await supabase
        .from('schedule_definitions')
        .select(`
          *,
          schedule_details (*),
          schedule_parameters (*)
        `)
        .in('entity_id', (entitiesData || []).map(entity => entity.entity_id));
      if (scheduleError) throw scheduleError;

      // Transform the data to match our Entity interface
      return (entitiesData as DbEntity[]).map(entity => ({
        entity_id: entity.entity_id,
        entity_name: entity.entity_name || '',
        settings: (processSettingsData as DbEntityProcessSetting[])
          ?.filter(setting => setting.entity_id === entity.entity_id)
          .map(setting => ({
            setting_id: setting.process_setting_id,
            entity_id: setting.entity_id,
            setting_value: setting.setting_value,
            is_active: setting.is_active ?? false
          })) || [],
        schedules: scheduleDefinitionsData?.filter(schedule => 
          schedule.entity_id === entity.entity_id
        ) || [],
        isEditing: false
      }));
    }
  });

  if (isLoadingTypes || isLoadingEntities) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!entities || entities.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found.
      </div>
    );
  }

  if (!processTypes || processTypes.length === 0) {
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
