
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

const MultiBankTab = () => {
  // Create 10 columns with no headers
  const columnDefs = Array(10).fill(null).map((_, index) => ({
    field: `col${index}`,
    headerName: '',
    width: 100,
    suppressMenu: true,
    sortable: false,
    filter: false,
    headerClass: 'hide-header'
  }));

  // Create 10x10 grid data
  const rowData = Array(10).fill(null).map((_, rowIndex) => {
    const row = {};
    for (let colIndex = 0; colIndex < 10; colIndex++) {
      row[`col${colIndex}`] = '';
    }
    return row;
  });

  return (
    <div className="p-4">
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: '1000px',
          width: '1000px'
        }}
      >
        <GridStyles />
        <style>
          {`
            .hide-header {
              display: none;
            }
            .ag-root-wrapper {
              border: none !important;
            }
            .ag-row {
              border: 1px solid #ddd !important;
            }
            .ag-cell {
              border-right: 1px solid #ddd !important;
            }
          `}
        </style>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          suppressMovableColumns={true}
          suppressColumnMoveAnimation={true}
          suppressRowHoverHighlight={true}
          suppressCellSelection={true}
          headerHeight={0}
        />
      </div>
    </div>
  );
};

export default MultiBankTab;
