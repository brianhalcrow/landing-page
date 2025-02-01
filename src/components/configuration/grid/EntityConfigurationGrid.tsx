import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { createBaseColumnDefs, createExposureColumns, createActionColumn } from './columnDefs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface EntityConfigurationGridProps {
  entities: any[];
  exposureTypes: any[];
}

const EntityConfigurationGrid = ({ entities, exposureTypes }: EntityConfigurationGridProps) => {
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: async (updates: { entityId: string; exposureTypeId: number; isActive: boolean }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('entity_exposure_config')
          .upsert({
            entity_id: update.entityId,
            exposure_type_id: update.exposureTypeId,
            is_active: update.isActive
          }, {
            onConflict: 'entity_id,exposure_type_id'
          });
        if (error) throw error;
      }
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

  const handleCellValueChanged = useCallback((params: any) => {
    console.log('Cell value changed:', params);
    
    if (params.data?.isEditing) {
      // Update the grid UI immediately
      params.node.setData(params.data);
      params.api.refreshCells({ 
        rowNodes: [params.node],
        force: true
      });
    }
  }, []);

  const allColumnDefs = [
    ...createBaseColumnDefs(),
    ...createExposureColumns(exposureTypes, handleCellValueChanged),
    createActionColumn()
  ];

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>
        {`
          .ag-header-cell,
          .ag-header-group-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .ag-header-cell-label,
          .ag-header-group-cell-label {
            width: 100% !important;
            text-align: center !important;
          }
          .ag-header-cell-text {
            text-overflow: clip !important;
            overflow: visible !important;
            white-space: normal !important;
          }
          .ag-header-group-cell-with-group {
            border-bottom: 1px solid #babfc7 !important;
          }
          .custom-header {
            white-space: normal !important;
            line-height: 1.2 !important;
          }
          .custom-header .ag-header-cell-label {
            padding: 4px !important;
          }
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .text-left {
            justify-content: flex-start !important;
          }
          .ag-header-viewport {
            overflow: visible !important;
          }
          .ag-header-container {
            overflow: visible !important;
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
          editable: false,
          wrapHeaderText: true,
          autoHeaderHeight: true
        }}
        context={{ updateConfig }}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        getRowId={(params) => params.data.entity_id}
      />
    </div>
  );
};

export default EntityConfigurationGrid;
