
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { mockData } from './mockData';
import { createColumnDefs, defaultColDef, autoGroupColumnDef } from './gridConfig';
import { useGridConfig } from './hooks/useGridConfig';

const OverviewTab = () => {
  const { onGridReady } = useGridConfig();
  const columnDefs = useMemo(() => createColumnDefs(), []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div 
        className="flex-grow ag-theme-alpine"
        style={{ 
          height: 'calc(100vh - 12rem)',
          minHeight: '500px',
          width: '100%'
        }}
      >
        <GridStyles />
        <AgGridReact
          rowData={mockData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
          domLayout="normal"
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={(event) => {
            if (event.colDef.field === 'forecast_amount') {
              console.log('Forecast amount changed:', event.data);
            }
          }}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
