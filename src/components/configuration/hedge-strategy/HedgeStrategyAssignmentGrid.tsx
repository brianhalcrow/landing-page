
import React, { useCallback, useMemo } from 'react';
import { HedgeStrategyGrid } from './components/HedgeStrategyGrid';
import { useHedgeStrategyData } from './hooks/useHedgeStrategyData';
import { useHedgeStrategyMutation } from './hooks/useHedgeStrategyMutation';
import { createColumnDefs } from './config/columnDefs';
import { HedgeStrategyGridRow } from './types/hedgeStrategy.types';

const HedgeStrategyAssignmentGrid = () => {
  const { rowData, isLoading } = useHedgeStrategyData();
  const assignmentMutation = useHedgeStrategyMutation();

  const handleAssignmentChange = useCallback((checked: boolean, data: HedgeStrategyGridRow) => {
    assignmentMutation.mutate({
      entityId: data.entity_id,
      counterpartyId: data.counterparty_id,
      hedgeStrategyId: parseInt(data.strategy),
      isAssigned: checked,
      assignmentId: data.assignmentId
    });
  }, [assignmentMutation]);

  const columnDefs = useMemo(() => createColumnDefs(handleAssignmentChange), [handleAssignmentChange]);

  if (isLoading) {
    return <div>Loading hedge strategy assignments...</div>;
  }

  return (
    <div className="space-y-4">
      <HedgeStrategyGrid 
        rowData={rowData}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default HedgeStrategyAssignmentGrid;
