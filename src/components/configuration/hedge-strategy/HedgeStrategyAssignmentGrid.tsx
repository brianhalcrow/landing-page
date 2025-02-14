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
      console.log('Starting to fetch data for hedge strategy assignments');
      
      // Fetch active entities
      const { data: entities, error: entitiesError } = await supabase
        .from('entities')
        .select('*')
        .eq('is_active', true);

      if (entitiesError) {
        console.error('Error fetching entities:', entitiesError);
        throw entitiesError;
      }
      console.log('Fetched entities:', entities);

      // Fetch all exposure types
      const { data: exposureTypes, error: exposureTypesError } = await supabase
        .from('exposure_types')
        .select('*')
        .eq('is_active', true);

      if (exposureTypesError) {
        console.error('Error fetching exposure types:', exposureTypesError);
        throw exposureTypesError;
      }
      console.log('Fetched exposure types:', exposureTypes);

      // Fetch hedge strategies
      const { data: hedgeStrategies, error: strategiesError } = await supabase
        .from('hedge_strategy')
        .select('*');

      if (strategiesError) {
        console.error('Error fetching hedge strategies:', strategiesError);
        throw strategiesError;
      }
      console.log('Fetched hedge strategies:', hedgeStrategies);

      // Fetch counterparties
      const { data: counterparties, error: counterpartiesError } = await supabase
        .from('counterparty')
        .select('*');

      if (counterpartiesError) {
        console.error('Error fetching counterparties:', counterpartiesError);
        throw counterpartiesError;
      }
      console.log('Fetched counterparties:', counterparties);

      // Fetch existing assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('hedge_strategy_assignment')
        .select('*');

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        throw assignmentsError;
      }
      console.log('Fetched assignments:', assignments);

      // Process and combine the data
      const gridRows: HedgeStrategyGridRow[] = [];
      
      if (!entities?.length) {
        console.warn('No active entities found');
        return [];
      }

      // Get unique exposure categories
      const uniqueExposureCategories = [...new Set(exposureTypes?.map(et => et.exposure_category_l2) || [])];
      console.log('Unique exposure categories:', uniqueExposureCategories);

      // Create grid rows for all combinations
      entities.forEach(entity => {
        console.log(`Processing entity: ${entity.entity_name}`);
        
        uniqueExposureCategories.forEach(exposureCategoryL2 => {
          // Find matching strategies for this exposure category
          const matchingStrategies = hedgeStrategies?.filter(
            strategy => strategy.exposure_category_l2 === exposureCategoryL2
          ) || [];

          if (!matchingStrategies.length) {
            console.log(`No strategies found for category ${exposureCategoryL2}`);
            return;
          }

          // Create a row for each strategy-counterparty combination
          matchingStrategies.forEach(strategy => {
            counterparties?.forEach(counterparty => {
              // Check if this combination has an existing assignment
              const assignment = assignments?.find(
                a => a.entity_id === entity.entity_id &&
                    a.counterparty_id === counterparty.counterparty_id &&
                    a.hedge_strategy_id === strategy.id
              );

              gridRows.push({
                entity_id: entity.entity_id,
                entity_name: entity.entity_name,
                exposure_category_l2: exposureCategoryL2,
                strategy: strategy.id.toString(),
                strategy_name: strategy.strategy,
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

      console.log('Generated grid rows:', gridRows);
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
      rowGroup: true,
      hide: true
    },
    {
      field: 'exposure_category_l2',
      headerName: 'Exposure Category',
      width: 150,
      rowGroup: true,
      hide: true
    },
    {
      field: 'strategy_name',
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

  if (isLoading) {
    return <div>Loading hedge strategy assignments...</div>;
  }

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
