import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { columnDefs } from './columnDefs';
import { useRef } from 'react';

interface HedgeRequestGridProps {
  hedgeRequests: any[]; // We'll type this properly once we define the interface
}

const HedgeRequestGrid = ({ hedgeRequests }: HedgeRequestGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  if (!hedgeRequests?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No hedge requests found.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>
        {`
          .ag-header-center .ag-header-cell-label {
            justify-content: center;
          }
        `}
      </style>
      <AgGridReact
        ref={gridRef}
        rowData={hedgeRequests}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default HedgeRequestGrid;