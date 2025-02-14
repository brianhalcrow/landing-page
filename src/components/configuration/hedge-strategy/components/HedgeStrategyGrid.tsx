
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from '@/components/shared/grid/GridStyles';
import { HedgeStrategyGridRow } from '../types/hedgeStrategy.types';

interface HedgeStrategyGridProps {
  rowData: HedgeStrategyGridRow[];
  columnDefs: ColDef[];
}

export const HedgeStrategyGrid = ({ rowData, columnDefs }: HedgeStrategyGridProps) => {
  return (
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
  );
};
