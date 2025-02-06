import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';

const ProcessGrid = () => {
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
            entitySettings.find(es => es.process_setting_id === ps.process_setting_id)?.setting_value || ''
          ])
        );

        return {
          entity_id: entity.entity_id,
          entity_name: entity.entities?.entity_name,
          ...settingsMap
        };
      });
    },
    enabled: !!processSettings
  });

  // Create dynamic columns based on process settings
  const columnDefs: ColDef[] = [
    {
      field: 'entity_name',
      headerName: 'Entity',
      width: 200,
      sort: 'asc',
      pinned: 'left'
    },
    ...(processSettings || []).map(setting => ({
      field: `setting_${setting.process_setting_id}`,
      headerName: setting.setting_name,
      flex: 1,
    }))
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
      />
    </div>
  );
};

export default ProcessGrid;