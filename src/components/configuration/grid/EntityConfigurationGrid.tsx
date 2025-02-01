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

  const validateExposureConfig = (updates: { entityId: string; exposureTypeId: number; isActive: boolean }[]) => {
    const exposureMap = new Map<string, { [key: string]: boolean }>();
    
    // Group updates by entity
    updates.forEach(update => {
      if (!exposureMap.has(update.entityId)) {
        exposureMap.set(update.entityId, {});
      }
      const entityConfig = exposureMap.get(update.entityId)!;
      entityConfig[`exposure_${update.exposureTypeId}`] = update.isActive;
    });

    // Validate each entity's configuration
    for (const [entityId, config] of exposureMap.entries()) {
      // Monetary validation
      if (config['exposure_monetary_assets'] && config['exposure_monetary_liabilities']) {
        config['exposure_net_monetary'] = true;
        config['exposure_monetary_assets'] = false;
        config['exposure_monetary_liabilities'] = false;
      }
      if (config['exposure_net_monetary']) {
        config['exposure_monetary_assets'] = false;
        config['exposure_monetary_liabilities'] = false;
      }

      // Revenue/Expense/Net Income validation
      if (config['exposure_revenue'] && config['exposure_costs']) {
        config['exposure_net_income'] = true;
        config['exposure_revenue'] = false;
        config['exposure_costs'] = false;
      }
      if (config['exposure_net_income']) {
        config['exposure_revenue'] = false;
        config['exposure_costs'] = false;
      }

      // Update the map with validated config
      exposureMap.set(entityId, config);
    }

    // Convert back to array of updates
    const validatedUpdates: typeof updates = [];
    for (const [entityId, config] of exposureMap.entries()) {
      Object.entries(config).forEach(([key, value]) => {
        const exposureTypeId = parseInt(key.replace('exposure_', ''));
        validatedUpdates.push({
          entityId,
          exposureTypeId,
          isActive: value
        });
      });
    }

    return validatedUpdates;
  };

  const updateConfig = useMutation({
    mutationFn: async (updates: { entityId: string; exposureTypeId: number; isActive: boolean }[]) => {
      const validatedUpdates = validateExposureConfig(updates);
      
      for (const update of validatedUpdates) {
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
      />
    </div>
  );
};

export default EntityConfigurationGrid;