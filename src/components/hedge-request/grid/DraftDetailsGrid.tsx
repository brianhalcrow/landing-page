import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { draftDetailsColumnDefs } from './draftDetailsColumnDefs';
import { useRef } from 'react';

interface HedgeRequestDraft {
  id: string;
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  cost_centre: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  instrument: string;
}

interface DraftDetailsGridProps {
  hedgeRequests: HedgeRequestDraft[];
}

const DraftDetailsGrid = ({ hedgeRequests }: DraftDetailsGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  if (!hedgeRequests?.length) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No hedge request drafts found.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
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
        columnDefs={draftDetailsColumnDefs}
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

export default DraftDetailsGrid;