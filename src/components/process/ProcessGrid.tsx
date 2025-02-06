
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import CheckboxCellRenderer from '@/components/configuration/grid/cellRenderers/CheckboxCellRenderer';
import { toast } from 'sonner';
import { Edit, Save } from 'lucide-react';
import { Button } from '../ui/button';

const ProcessGrid = () => {
  const queryClient = useQueryClient();

  // First, fetch process settings to create columns
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
              setting_name
            )
          )
        `)
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
          (processTypes || []).flatMap(pt => 
            pt.process_options.flatMap(po => 
              po.process_settings.map(ps => [
                `setting_${ps.process_setting_id}`,
                entitySettings.find(es => es.process_setting_id === ps.process_setting_id)?.setting_value === 'true'
              ])
            )
          )
        );

        return {
          entity_id: entity.entity_id,
          entity_name: entity.entities?.entity_name,
          ...settingsMap,
          isEditing: false
        };
      });
    },
    enabled: !!processTypes
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

  // Create base columns for entity information
  const baseColumnDefs: ColDef[] = [
    {
      field: 'entity_id',
      headerName: 'Entity ID',
      width: 120,
      sort: 'asc',
      pinned: 'left',
      headerClass: 'ag-header-center custom-header'
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      width: 200,
      pinned: 'left',
      headerClass: 'ag-header-center custom-header'
    }
  ];

  // Create dynamic column groups based on process types and their settings
  const processColumnGroups: ColGroupDef[] = (processTypes || []).map(processType => ({
    headerName: processType.process_name,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.flatMap(option => 
      option.process_settings.map(setting => ({
        field: `setting_${setting.process_setting_id}`,
        headerName: setting.setting_name,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          value: params.value,
          hasSchedule: setting.setting_type === 'scheduled',
          entityId: params.data?.entity_id,
          processSettingId: setting.process_setting_id,
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
      }))
    )
  }));

  // Add actions column
  const actionsColumn: ColDef = {
    headerName: 'Actions',
    minWidth: 100,
    maxWidth: 100,
    headerClass: 'ag-header-center custom-header',
    cellRenderer: (params: any) => (
      <div className="flex items-center justify-center gap-2">
        {!params.data.isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const updatedData = { ...params.data, isEditing: true };
              params.node.setData(updatedData);
              params.api.refreshCells({ rowNodes: [params.node] });
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const updatedData = { ...params.data, isEditing: false };
              params.node.setData(updatedData);
              params.api.refreshCells({ rowNodes: [params.node] });
            }}
            className="h-8 w-8 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  };

  // Combine all column definitions
  const columnDefs = [...baseColumnDefs, ...processColumnGroups, actionsColumn];

  if (isLoadingTypes || isLoadingEntities) {
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
