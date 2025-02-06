import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import CheckboxCellRenderer from '../configuration/grid/CheckboxCellRenderer';
import { toast } from 'sonner';

const ProcessGrid = () => {
  const queryClient = useQueryClient();

  // First, fetch process settings to create columns
  const { data: processSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['process-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_settings')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Then, fetch entities with their process settings
  const { data: entitySettings, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entity-process-settings'],
    queryFn: async () => {
      // First get entities with exposure type 4
      const { data: entities, error: entitiesError } = await supabase
        .from('entity_exposure_config')
        .select(`
          entity_id,
          entities (
            entity_name
          )
        `)
        .eq('exposure_type_id', 4)
        .eq('is_active', true);

      if (entitiesError) throw entitiesError;

      // Then get their process settings
      const { data: settings, error: settingsError } = await supabase
        .from('entity_process_settings')
        .select('*')
        .in('entity_id', entities?.map(e => e.entity_id) || []);

      if (settingsError) throw settingsError;

      // Map settings to entities
      return entities?.map(entity => {
        const entitySettings = settings?.filter(s => s.entity_id === entity.entity_id) || [];
        
        // Create an object with all process settings as columns
        const settingsMap = Object.fromEntries(
          (processSettings || []).map(ps => [
            `setting_${ps.process_setting_id}`,
            entitySettings.find(es => es.process_setting_id === ps.process_setting_id)?.setting_value === 'true'
          ])
        );

        return {
          entity_id: entity.entity_id,
          entity_name: entity.entities?.entity_name,
          ...settingsMap,
          isEditing: false
        };
      });
    },
    enabled: !!processSettings
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: { entityId: string; processSettingId: number; settingValue: string }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('entity_process_settings')
          .upsert({
            entity_id: update.entityId,
            process_setting_id: update.processSettingId,
            setting_value: update.settingValue
          }, {
            onConflict: 'entity_id,process_setting_id'
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-process-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  });

  const handleCellValueChanged = async (params: any) => {
    if (params.data?.isEditing) {
      const fieldName = params.column.getColId();
      if (fieldName.startsWith('setting_')) {
        const processSettingId = parseInt(fieldName.replace('setting_', ''));
        const updates = [{
          entityId: params.data.entity_id,
          processSettingId,
          settingValue: params.newValue.toString()
        }];
        
        try {
          await updateSettings.mutateAsync(updates);
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      }
    }
  };

  // Create dynamic columns based on process settings
  const columnDefs: ColDef[] = [
    {
      field: 'entity_name',
      headerName: 'Entity',
      width: 200,
      sort: 'asc',
      pinned: 'left',
      headerClass: 'ag-header-center custom-header'
    },
    ...(processSettings || []).map(setting => ({
      field: `setting_${setting.process_setting_id}`,
      headerName: setting.setting_name,
      flex: 1,
      headerClass: 'ag-header-center custom-header',
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: (params: any) => ({
        disabled: !params.data?.isEditing,
        value: params.value,
        onChange: (checked: boolean) => {
          if (params.node && params.api) {
            const updatedData = { ...params.data };
            updatedData[params.column.getColId()] = checked;
            params.node.setData(updatedData);
            params.api.refreshCells({ 
              rowNodes: [params.node],
              force: true
            });
          }
        }
      })
    })),
    {
      headerName: 'Actions',
      minWidth: 100,
      maxWidth: 100,
      headerClass: 'ag-header-center custom-header',
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center gap-2">
          {!params.data.isEditing ? (
            <button
              onClick={() => {
                const updatedData = { ...params.data, isEditing: true };
                params.node.setData(updatedData);
                params.api.refreshCells({ rowNodes: [params.node] });
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                const updatedData = { ...params.data, isEditing: false };
                params.node.setData(updatedData);
                params.api.refreshCells({ rowNodes: [params.node] });
              }}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          )}
        </div>
      )
    }
  ];

  if (isLoadingSettings || isLoadingEntities) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        Loading process settings...
      </div>
    );
  }

  if (!entitySettings?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found with exposure type 4.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={entitySettings}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
  );
};

export default ProcessGrid;