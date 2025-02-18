
import { ColDef } from "ag-grid-enterprise";
import { format } from "date-fns";

export const createDateColumns = (): ColDef[] => [
  {
    headerName: "Trade Date",
    field: "trade_date",
    sortable: true,
    filter: true,
    valueFormatter: (params) => {
      return params.value ? format(new Date(params.value), 'yyyy-MM-dd') : '';
    }
  },
  {
    headerName: "Settlement Date",
    field: "settlement_date",
    sortable: true,
    filter: true,
    valueFormatter: (params) => {
      return params.value ? format(new Date(params.value), 'yyyy-MM-dd') : '';
    }
  }
];
