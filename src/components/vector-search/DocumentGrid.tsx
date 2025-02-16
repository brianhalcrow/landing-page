import { AgGridReact } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";
import { useDocumentGrid } from "./hooks/useDocumentGrid";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

interface DocumentGridProps {
  documents: any[];
  onGridReady?: (api: any) => void;
}

export function DocumentGrid({ documents, onGridReady }: DocumentGridProps) {
  const { columnDefs, gridApi, setGridApi, gridColumnApi, setGridColumnApi } =
    useDocumentGrid();

  const handleGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    if (onGridReady) {
      onGridReady(params.api);
    }
  };

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <AgGridReact
        rowData={documents}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        animateRows={true}
        onGridReady={handleGridReady}
        onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
        getRowHeight={() => 100}
      />
    </div>
  );
}
