
import { AgGridReact } from 'ag-grid-react';
import { Badge } from "@/components/ui/badge";
import { useDocumentGrid } from './hooks/useDocumentGrid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export function DocumentGrid({ documents }: { documents: any[] }) {
  const { 
    columnDefs, 
    onGridReady, 
    gridApi, 
    setGridApi, 
    gridColumnApi, 
    setGridColumnApi 
  } = useDocumentGrid();

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <AgGridReact
        rowData={documents}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true
        }}
        animateRows={true}
        onGridReady={onGridReady}
        onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
        getRowHeight={() => 100}
      />
    </div>
  );
}
