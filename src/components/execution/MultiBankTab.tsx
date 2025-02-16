
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

const MultiBankTab = () => {
  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'requestTime', headerName: 'Request Time', width: 180 },
    { field: 'currencyPair', headerName: 'Currency Pair', width: 150 },
    { field: 'direction', headerName: 'Direction', width: 120 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'banks', headerName: 'Banks', width: 200 },
    { field: 'bestRate', headerName: 'Best Rate', width: 150 },
    { field: 'executedWith', headerName: 'Executed With', width: 150 }
  ];

  const rowData = []; // Empty for now, will be populated later

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Multi-Bank RFQ</h2>
      <div className="ag-theme-alpine h-[600px] w-full">
        <GridStyles />
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default MultiBankTab;
