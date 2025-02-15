
import React, { useMemo } from 'react';
import { HedgeStrategyConfigGrid } from './components/HedgeStrategyConfigGrid';
import { useHedgeStrategyData } from './hooks/useHedgeStrategyData';
import { createColumnDefs } from './config/columnDefs';

const HedgeStrategyConfigDisplay = () => {
  const { rowData, isLoading } = useHedgeStrategyData();
  const columnDefs = useMemo(() => createColumnDefs(), []);

  if (isLoading) {
    return <div>Loading hedge strategy configurations...</div>;
  }

  return (
    <div className="space-y-4">
      <HedgeStrategyConfigGrid 
        rowData={rowData}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default HedgeStrategyConfigDisplay;
