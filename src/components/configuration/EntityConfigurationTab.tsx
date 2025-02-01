import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExposureTypes } from "@/hooks/useExposureTypes";
import { toast } from "sonner";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColDef, ColGroupDef } from 'ag-grid-community';

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

  const createExposureColumns = (exposureTypes: any[]): ColGroupDef[] => {
    // Group exposures by L1 and L2 categories
    const groupedExposures = exposureTypes.reduce((acc: any, type) => {
      const l1 = type.exposure_category_l1;
      const l2 = type.exposure_category_l2;
      
      if (!acc[l1]) acc[l1] = {};
      if (!acc[l1][l2]) acc[l1][l2] = [];
      
      acc[l1][l2].push(type);
      return acc;
    }, {});

    // Create hierarchical column structure
    return Object.entries(groupedExposures).map(([l1, l2Group]: [string, any]) => ({
      headerName: l1,
      groupId: l1,
      children: Object.entries(l2Group).map(([l2, types]: [string, any]) => ({
        headerName: l2,
        groupId: `${l1}-${l2}`,
        children: types.map((type: any) => ({
          headerName: type.exposure_category_l3,
          field: `exposure_${type.exposure_type_id}`,
          minWidth: 120,
          flex: 1,
          cellRenderer: (params: any) => {
            return params.value ? '✓' : '✗';
          },
          onCellValueChanged: (params: any) => {
            const entityId = params.data.entity_id;
            const exposureTypeId = parseInt(params.colDef.field.split('_')[1]);
            updateConfig.mutate({
              entityId,
              exposureTypeId,
              isActive: params.newValue
            });
          }
        }))
      }))
    }));
  };

  const baseColumnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'entity_id', headerName: 'Entity ID', minWidth: 90, flex: 1 },
    { field: 'entity_name', headerName: 'Entity Name', minWidth: 180, flex: 2 },
    { field: 'functional_currency', headerName: 'Functional Currency', minWidth: 75, flex: 1 },
    { field: 'accounting_rate_method', headerName: 'Accounting Rate Method', minWidth: 160, flex: 1.5 },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      minWidth: 100, 
      flex: 1,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    }
  ];

  const allColumnDefs = exposureTypes 
    ? [...baseColumnDefs, ...createExposureColumns(exposureTypes)]
    : baseColumnDefs;

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
        <div className="w-full h-[600px] ag-theme-alpine">
          <AgGridReact
            rowData={entities}
            columnDefs={allColumnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              editable: true
            }}
            suppressColumnVirtualisation={true}
            enableCellTextSelection={true}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;