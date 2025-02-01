import { Suspense, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HotTableProps } from '@handsontable/react-wrapper';
import { useExposureTypes } from "@/hooks/useExposureTypes";
import { toast } from "sonner";

// Register all Handsontable modules
registerAllModules();

const EntityConfigurationTab = () => {
  const queryClient = useQueryClient();
  const { data: exposureTypes, isLoading: isLoadingExposureTypes } = useExposureTypes();
  
  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data: entitiesData, error: entitiesError } = await supabase
        .from('entities')
        .select('*');
      
      if (entitiesError) throw entitiesError;

      // Fetch exposure configurations for all entities
      const { data: configsData, error: configsError } = await supabase
        .from('entity_exposure_config')
        .select('*');

      if (configsError) throw configsError;

      // Merge entities with their exposure configurations
      return entitiesData.map(entity => {
        const entityConfigs = configsData.filter(config => 
          config.entity_id === entity.entity_id
        );

        const exposureConfigs = Object.fromEntries(
          entityConfigs.map(config => [
            `exposure_${config.exposure_type_id}`,
            config.is_active
          ])
        );

        return {
          ...entity,
          ...exposureConfigs
        };
      });
    }
  });

  const updateConfig = useMutation({
    mutationFn: async ({ 
      entityId, 
      exposureTypeId, 
      isActive 
    }: { 
      entityId: string; 
      exposureTypeId: number; 
      isActive: boolean 
    }) => {
      const { error } = await supabase
        .from('entity_exposure_config')
        .upsert({
          entity_id: entityId,
          exposure_type_id: exposureTypeId,
          is_active: isActive
        }, {
          onConflict: 'entity_id,exposure_type_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      toast.success('Configuration updated successfully');
    },
    onError: (error) => {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    }
  });

  const handleAfterChange = useCallback((changes: any[] | null) => {
    if (!changes) return;

    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (prop.startsWith('exposure_') && entities) {
        const entityId = entities[row].entity_id;
        const exposureTypeId = parseInt(prop.split('_')[1]);
        
        updateConfig.mutate({
          entityId,
          exposureTypeId,
          isActive: newValue
        });
      }
    });
  }, [entities, updateConfig]);

  if (isLoadingEntities || isLoadingExposureTypes) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const exposureColumns = exposureTypes?.map(type => ({
    data: `exposure_${type.exposure_type_id}`,
    type: 'checkbox',
    editor: 'checkbox',
    renderer: 'checkbox',
    header: `${type.exposure_category_l1} - ${type.exposure_category_l2} - ${type.exposure_category_l3}`,
    width: 200
  })) || [];

  const settings: HotTableProps = {
    data: entities || [],
    colHeaders: [
      'Entity ID', 
      'Entity Name', 
      'Functional Currency', 
      'Accounting Rate Method', 
      'Active',
      ...(exposureTypes?.map(type => 
        `${type.exposure_category_l1} - ${type.exposure_category_l2} - ${type.exposure_category_l3}`
      ) || [])
    ],
    columns: [
      { data: 'entity_id', readOnly: true },
      { data: 'entity_name' },
      { data: 'functional_currency' },
      { data: 'accounting_rate_method' },
      { 
        data: 'is_active',
        type: 'checkbox',
        editor: 'checkbox',
        renderer: 'checkbox'
      },
      ...exposureColumns
    ],
    afterChange: handleAfterChange,
    licenseKey: 'non-commercial-and-evaluation',
    height: 'auto',
    width: '100%',
    stretchH: 'all' as const
  };

  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Entity Configuration</h2>
        <div className="w-full overflow-x-auto">
          <HotTable {...settings} />
        </div>
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;