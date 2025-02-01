import { Suspense, useEffect } from "react";
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
      // First fetch all entities
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('entities')
        .select('*');
      
      if (entitiesError) throw entitiesError;

      console.log('Raw entities data:', entitiesData);

      // Then fetch all entity exposure configurations
      const { data: configsData, error: configsError } = await supabase
        .from('entity_exposure_config')
        .select('*')
        .in('entity_id', entitiesData.map(entity => entity.entity_id));

      if (configsError) throw configsError;

      console.log('Raw configs data:', configsData);

      // Map entities with their configurations
      const mappedEntities = entitiesData.map(entity => {
        // Filter configurations for this specific entity
        const entityConfigs = configsData.filter(config => 
          config.entity_id === entity.entity_id
        );

        // Create an object with all exposure types set to false by default
        const exposureConfigs = Object.fromEntries(
          (exposureTypes || []).map(type => [
            `exposure_${type.exposure_type_id}`,
            false
          ])
        );

        // Update with actual configurations from the database
        entityConfigs.forEach(config => {
          exposureConfigs[`exposure_${config.exposure_type_id}`] = config.is_active;
        });

        const result = {
          ...entity,
          ...exposureConfigs,
          isEditing: false
        };

        return result;
      });

      console.log('Mapped entities:', mappedEntities[0]); // Log first mapped entity
      return mappedEntities;
    },
    enabled: !!exposureTypes // Only run query when exposure types are available
  });

  // Debug logging
  useEffect(() => {
    if (entities && exposureTypes) {
      console.log('First entity with configs:', entities[0]);
      console.log('Available exposure types:', exposureTypes);
    }
  }, [entities, exposureTypes]);

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
