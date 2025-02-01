import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { columnDefs } from './columnDefs';
import { useRef } from 'react';

interface HedgeRequestDraft {
  id: string;
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  cost_centre: string;
  status: string;
}

interface HedgeRequestGridProps {
  hedgeRequests: HedgeRequestDraft[];
}

const HedgeRequestGrid = ({ hedgeRequests }: HedgeRequestGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  if (!hedgeRequests?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No hedge request drafts found.
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
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
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