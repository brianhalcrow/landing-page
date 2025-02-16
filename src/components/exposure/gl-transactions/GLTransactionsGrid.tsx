import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import { GLTransaction } from "./types";
import { GridStyles } from "../../hedge-request/grid/components/GridStyles";

interface GLTransactionsGridProps {
  transactions: GLTransaction[];
}

const GLTransactionsGrid = ({ transactions }: GLTransactionsGridProps) => {
  const columnDefs: ColDef[] = [
    {
      field: "entity",
      headerName: "Entity",
      flex: 1,
      minWidth: 120,
      headerClass: "ag-header-center",
    },
    {
      field: "entity_id",
      headerName: "Entity ID",
      flex: 1,
      minWidth: 100,
      headerClass: "ag-header-center",
    },
    {
      field: "cost_centre",
      headerName: "Cost Centre",
      flex: 1,
      minWidth: 120,
      headerClass: "ag-header-center",
    },
    {
      field: "account_number",
      headerName: "Account Number",
      flex: 1,
      minWidth: 130,
      headerClass: "ag-header-center",
    },
    {
      field: "account_name",
      headerName: "Account Name",
      flex: 1.5,
      minWidth: 150,
      headerClass: "ag-header-center",
    },
    {
      field: "transaction_currency",
      headerName: "Currency",
      flex: 0.8,
      minWidth: 100,
      headerClass: "ag-header-center",
    },
    {
      field: "transaction_amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
      headerClass: "ag-header-center",
      type: "numericColumn",
      valueFormatter: (params) => {
        return params.value
          ? params.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "";
      },
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      flex: 1,
      minWidth: 120,
      headerClass: "ag-header-center",
      type: "numericColumn",
      valueFormatter: (params) => {
        return params.value
          ? params.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "";
      },
    },
    {
      field: "document_date",
      headerName: "Document Date",
      flex: 1,
      minWidth: 120,
      headerClass: "ag-header-center",
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : "";
      },
    },
    {
      field: "period",
      headerName: "Period",
      flex: 0.8,
      minWidth: 100,
      headerClass: "ag-header-center",
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0.8,
      minWidth: 100,
      headerClass: "ag-header-center",
    },
  ];

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={transactions}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false,
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        pagination={false}
        rowBuffer={10}
      />
    </div>
  );
};

export default GLTransactionsGrid;
