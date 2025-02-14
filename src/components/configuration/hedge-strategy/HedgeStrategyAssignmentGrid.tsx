
import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { HedgeStrategyGridRow } from './types/hedgeStrategy.types';
import CheckboxCellRenderer from '../grid/cellRenderers/CheckboxCellRenderer';
import { GridStyles } from '@/components/shared/grid/GridStyles';

const HedgeStrategyAssignmentGrid = () => {
  const queryClient = useQueryClient();
  const [rowData, setRowData] = useState<HedgeStrategyGridRow[]>([]);
  
  // Fetch all required data
  const { isLoading } = useQuery({
    queryKey: ['hedge-strategy-assignments'],
    queryFn: async () => {
      const { data: entities } = await supabase
        .from('entities')
        .select('*')
        .eq('is_active', true);

      const { data: exposureConfigs } = await supabase
        .from('entity_exposure_config')
        .select('*')
        .eq('is_active', true);

      const { data: hedgeStrategies } = await supabase
        .from('hedge_strategy')
        .select('*');

      const { data: counterparties } = await supabase
        .from('counterparty')
        .select('*');

      const { data: assignments } = await supabase
        .from('hedge_strategy_assignment')
        .select('*');

      // Process and combine the data
      const gridRows: HedgeStrategyGridRow[] = [];
      
      entities?.forEach(entity => {
        const entityConfigs = exposureConfigs?.filter(
          config => config.entity_id === entity.entity_id
        ) || [];

        entityConfigs.forEach(config => {
          hedgeStrategies?.forEach(strategy => {
            counterparties?.forEach(counterparty => {
              const assignment = assignments?.find(
                a => a.entity_id === entity.entity_id &&
                    a.counterparty_id === counterparty.counterparty_id &&
                    a.hedge_strategy_id === strategy.id
              );

              gridRows.push({
                entity_id: entity.entity_id,
                entity_name: entity.entity_name,
                exposure_category_l2: strategy.exposure_category_l2,
                strategy: strategy.strategy,
                strategy_description: strategy.strategy_description,
                instrument: strategy.instrument,
                counterparty_id: counterparty.counterparty_id,
                counterparty_name: counterparty.counterparty_name || '',
                isAssigned: !!assignment,
                assignmentId: assignment?.id
              });
            });
          });
        });
      });

      setRowData(gridRows);
      return gridRows;
    }
  });

  // Mutation for creating/updating assignments
  const assignmentMutation = useMutation({
    mutationFn: async ({ 
      entityId, 
      counterpartyId, 
      hedgeStrategyId,
      isAssigned,
      assignmentId 
    }: {
      entityId: string;
      counterpartyId: string;
      hedgeStrategyId: number;
      isAssigned: boolean;
      assignmentId?: string;
    }) => {
      if (isAssigned) {
        const { error } = await supabase
          .from('hedge_strategy_assignment')
          .insert({
            entity_id: entityId,
            counterparty_id: counterpartyId,
            hedge_strategy_id: hedgeStrategyId
          });
        if (error) throw error;
      } else if (assignmentId) {
        const { error } = await supabase
          .from('hedge_strategy_assignment')
          .delete()
          .eq('id', assignmentId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hedge-strategy-assignments'] });
      toast.success('Hedge strategy assignment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update hedge strategy assignment');
    }
  });

  const handleAssignmentChange = useCallback((checked: boolean, data: HedgeStrategyGridRow) => {
    assignmentMutation.mutate({
      entityId: data.entity_id,
      counterpartyId: data.counterparty_id,
      hedgeStrategyId: parseInt(data.strategy),
      isAssigned: checked,
      assignmentId: data.assignmentId
    });
  }, [assignmentMutation]);

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'entity_name',
      headerName: 'Entity',
      width: 150,
      rowGroup: true
    },
    {
      field: 'exposure_category_l2',
      headerName: 'Exposure Category',
      width: 150,
      rowGroup: true
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      width: 150
    },
    {
      field: 'strategy_description',
      headerName: 'Description',
      width: 200
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      width: 120
    },
    {
      field: 'counterparty_name',
      headerName: 'Counterparty',
      width: 150
    },
    {
      field: 'isAssigned',
      headerName: 'Assigned',
      width: 100,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        onChange: handleAssignmentChange
      }
    }
  ], [handleAssignmentChange]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true
          }}
          groupDefaultExpanded={-1}
          animateRows={true}
          suppressRowClickSelection={true}
        />
      </div>
    </div>
  );
};

export default HedgeStrategyAssignmentGrid;
