import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExposureTypes } from "@/hooks/useExposureTypes";
import EntityConfigurationGrid from "./grid/EntityConfigurationGrid";

// Interfaces for type safety
interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  is_active: boolean;
  [key: string]: any; // For dynamic exposure fields
}

interface ExposureConfig {
  entity_id: string;
  exposure_type_id: number;
  is_active: boolean;
}

const EntityConfigurationTab = () => {
  // Fetch exposure types
  const { data: exposureTypes, isLoading: isLoadingExposureTypes } = useExposureTypes();
  
  // Fetch entities and their configurations
  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      // Log exposure types for debugging
      console.log('Available exposure types:', exposureTypes);

      // Fetch all entities
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('entities')
        .select('*');
      
      if (entitiesError) {
        console.error('Error fetching entities:', entitiesError);
        throw entitiesError;
      }

      console.log('Raw entities data:', entitiesData);

      // Fetch all entity exposure configurations
      const { data: configsData, error: configsError } = await supabase
        .from('entity_exposure_config')
        .select('*')
        .in('entity_id', entitiesData.map(entity => entity.entity_id));

      if (configsError) {
        console.error('Error fetching configurations:', configsError);
        throw configsError;
      }

      console.log('Raw exposure configurations:', configsData);

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

        const mappedEntity = {
          ...entity,
          ...exposureConfigs,
          isEditing: false
        };

        // Log the mapped entity for debugging
        if (entity.entity_id === entitiesData[0].entity_id) {
          console.log('First mapped entity:', mappedEntity);
          console.log('Its exposure configurations:', entityConfigs);
        }

        return mappedEntity;
      });

      return mappedEntities;
    },
    enabled: !!exposureTypes // Only run query when exposure types are available
  });

  // Debug logging for data changes
  useEffect(() => {
    if (entities && exposureTypes) {
      console.log('=== Data Loading Complete ===');
      console.log('Number of entities loaded:', entities.length);
      console.log('Number of exposure types:', exposureTypes.length);
      console.log('First entity data:', entities[0]);
    }
  }, [entities, exposureTypes]);

  // Loading state
  if (isLoadingEntities || isLoadingExposureTypes) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  // No data state
  if (!entities?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found.
      </div>
    );
  }

  // Error states
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
