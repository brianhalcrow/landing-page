
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";

const OverviewTab = () => {
  const columnDefs: ColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
      headerClass: 'ag-header-left',
      cellClass: 'cell-left'
    }
  ];

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={[]}
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

export default OverviewTab;
