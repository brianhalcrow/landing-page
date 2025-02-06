import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExposureTypes } from "@/hooks/useExposureTypes";
import EntityConfigurationGrid from "./grid/EntityConfigurationGrid";

interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  is_active: boolean;
  [key: string]: any;
}

interface ExposureConfig {
  entity_id: string;
  exposure_type_id: number;
  is_active: boolean;
}

const EntityConfigurationTab = () => {
  const { data: exposureTypes, isLoading: isLoadingExposureTypes } = useExposureTypes();
  
  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('entities')
        .select('*');
      
      if (entitiesError) {
        throw entitiesError;
      }

      const { data: configsData, error: configsError } = await supabase
        .from('entity_exposure_config')
        .select('*')
        .in('entity_id', entitiesData.map(entity => entity.entity_id));

      if (configsError) {
        throw configsError;
      }

      const mappedEntities = entitiesData.map(entity => {
        const entityConfigs = configsData.filter(config => 
          config.entity_id === entity.entity_id
        );

        const exposureConfigs = Object.fromEntries(
          (exposureTypes || []).map(type => [
            `exposure_${type.exposure_type_id}`,
            false
          ])
        );

        entityConfigs.forEach(config => {
          exposureConfigs[`exposure_${config.exposure_type_id}`] = config.is_active;
        });

        return {
          ...entity,
          ...exposureConfigs,
          isEditing: false
        };
      });

      return mappedEntities;
    },
    enabled: !!exposureTypes
  });

  if (isLoadingEntities || isLoadingExposureTypes) {
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

  if (!exposureTypes?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No exposure types configured.
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
        <h2 className="text-2xl font-semibold mb-4">Entity Configuration</h2>
        <EntityConfigurationGrid 
          entities={entities}
          exposureTypes={exposureTypes}
        />
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;