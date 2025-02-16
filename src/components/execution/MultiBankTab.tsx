
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

// Define the interface for our row data
interface RowDataType {
  [key: string]: string;
  col0: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
  col7: string;
  col8: string;
  col9: string;
}

const MultiBankTab = () => {
  // Create 10 columns with no headers
  const columnDefs: ColDef<RowDataType>[] = Array(10).fill(null).map((_, index) => ({
    field: `col${index}` as keyof RowDataType,
    headerName: '',
    width: 100,
    suppressMenu: true,
    sortable: false,
    filter: false,
    headerClass: 'hide-header'
  }));

  // Create 10x10 grid data
  const rowData: RowDataType[] = Array(10).fill(null).map(() => ({
    col0: '',
    col1: '',
    col2: '',
    col3: '',
    col4: '',
    col5: '',
    col6: '',
    col7: '',
    col8: '',
    col9: ''
  }));

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
        <AgGridReact<RowDataType>
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
