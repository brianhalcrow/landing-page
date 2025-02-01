import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { createBaseColumnDefs, createExposureColumns, createActionColumn } from './columnDefs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EntityConfigurationGridProps {
  entities: any[];
  exposureTypes: any[];
}

const EntityConfigurationGrid = ({ entities, exposureTypes }: EntityConfigurationGridProps) => {
  const queryClient = useQueryClient();

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

  const allColumnDefs = [
    ...createBaseColumnDefs(),
    ...createExposureColumns(exposureTypes),
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
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default EntityConfigurationGrid;