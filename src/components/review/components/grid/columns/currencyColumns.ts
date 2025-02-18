
import { ColDef } from "ag-grid-enterprise";

export const createCurrencyColumns = (): ColDef[] => [
  {
    headerName: "Currency Pair",
    field: "ccy_pair",
    sortable: true,
    filter: true
  },
  {
    headerName: "Buy CCY",
    field: "ccy_1",
    sortable: true,
    filter: true
  },
  {
    headerName: "Buy Amount",
    field: "ccy_1_amount",
    sortable: true,
    filter: true,
    valueFormatter: (params) => {
      return params.value ? params.value.toLocaleString() : '';
    }
  },
  {
    headerName: "Sell CCY",
    field: "ccy_2",
    sortable: true,
    filter: true
  },
  {
    headerName: "Sell Amount",
    field: "ccy_2_amount",
    sortable: true,
    filter: true,
    valueFormatter: (params) => {
      return params.value ? params.value.toLocaleString() : '';
    }
  }
];
