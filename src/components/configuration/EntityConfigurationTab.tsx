import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExposureTypes } from "@/hooks/useExposureTypes";
import EntityConfigurationGrid from "./grid/EntityConfigurationGrid";

const EntityConfigurationTab = () => {
  const { data: exposureTypes, isLoading: isLoadingExposureTypes } = useExposureTypes();
  
  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('entities')
        .select('*');
      
      if (entitiesError) throw entitiesError;

      const { data: configsData, error: configsError } = await supabase
        .from('entity_exposure_config')
        .select('*');

      if (configsError) throw configsError;

      return entitiesData.map(entity => {
        const entityConfigs = configsData.filter(config => 
          config.entity_id === entity.entity_id
        );

        const exposureConfigs = Object.fromEntries(
          entityConfigs.map(config => [
            `exposure_${config.exposure_type_id}`,
            !!config.is_active
          ])
        );

        return {
          ...entity,
          ...exposureConfigs,
          isEditing: false
        };
      });
    }
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
          exposureTypes={exposureTypes || []}
        />
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;