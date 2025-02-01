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
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

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
            config.is_active
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
    const groupedExposures = exposureTypes.reduce((acc: any, type) => {
      const l1 = type.exposure_category_l1;
      const l2 = type.exposure_category_l2;
      
      if (!acc[l1]) acc[l1] = {};
      if (!acc[l1][l2]) acc[l1][l2] = [];
      
      acc[l1][l2].push(type);
      return acc;
    }, {});

    return Object.entries(groupedExposures).map(([l1, l2Group]: [string, any]) => ({
      headerName: l1,
      groupId: l1,
      headerClass: 'ag-header-center',
      children: Object.entries(l2Group).map(([l2, types]: [string, any]) => ({
        headerName: l2,
        groupId: `${l1}-${l2}`,
        headerClass: 'ag-header-center',
        children: types.map((type: any) => ({
          headerName: type.exposure_category_l3,
          field: `exposure_${type.exposure_type_id}`,
          minWidth: 120,
          flex: 1,
          headerClass: 'ag-header-center',
          cellRenderer: (params: any) => {
            if (!params.data.isEditing) {
              return params.value ? '✓' : '✗';
            }
            return (
              <input
                type="checkbox"
                checked={params.value}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  params.setValue(newValue);
                  updateConfig.mutate({
                    entityId: params.data.entity_id,
                    exposureTypeId: parseInt(params.colDef.field.split('_')[1]),
                    isActive: newValue
                  });
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
            );
          }
        }))
      }))
    }));
  };

  const baseColumnDefs: (ColDef | ColGroupDef)[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      minWidth: 90, 
      flex: 1,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      minWidth: 180, 
      flex: 2,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'functional_currency', 
      headerName: 'Functional Currency', 
      minWidth: 75, 
      flex: 1,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'accounting_rate_method', 
      headerName: 'Accounting Rate Method', 
      minWidth: 160, 
      flex: 1.5,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'is_active', 
      headerName: 'Is Active', 
      minWidth: 100, 
      flex: 1,
      headerClass: 'ag-header-center',
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    },
    {
      headerName: 'Actions',
      minWidth: 120,
      flex: 1,
      headerClass: 'ag-header-center',
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {!params.data.isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (params.api && params.node) {
                    params.node.setDataValue('isEditing', true);
                  }
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (params.api && params.node) {
                    params.node.setDataValue('isEditing', false);
                  }
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
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
          <style>
            {`
              .ag-header-center .ag-header-cell-label {
                justify-content: center;
              }
            `}
          </style>
          <AgGridReact
            rowData={entities}
            columnDefs={allColumnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              editable: false
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