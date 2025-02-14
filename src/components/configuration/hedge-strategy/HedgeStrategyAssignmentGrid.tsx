
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
  
  // Fetch data using our new view
  const { isLoading } = useQuery({
    queryKey: ['hedge-strategy-assignments'],
    queryFn: async () => {
      console.log('Fetching hedge strategy assignments from view');
      
      const { data: configurations, error } = await supabase
        .from('v_valid_hedge_configurations')
        .select('*');

      if (error) {
        console.error('Error fetching configurations:', error);
        throw error;
      }

      console.log('Fetched configurations:', configurations);

      // Transform view data into grid rows
      const gridRows: HedgeStrategyGridRow[] = configurations.map(config => ({
        entity_id: config.entity_id,
        entity_name: config.entity_name,
        exposure_category_l2: config.exposure_category_l2,
        strategy: config.strategy_id.toString(),
        strategy_name: config.strategy,
        strategy_description: config.strategy_description,
        instrument: config.instrument,
        counterparty_id: config.counterparty_id,
        counterparty_name: config.counterparty_name,
        isAssigned: config.is_assigned,
        assignmentId: config.assignment_id
      }));

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
