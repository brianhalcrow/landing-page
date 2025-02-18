
import { ColDef } from "ag-grid-enterprise";
import { format } from "date-fns";

export const createBaseColumns = (): ColDef[] => [
  {
    headerName: "Request #",
    field: "request_no",
    sortable: true,
    filter: true,
    width: 120
  },
  {
    headerName: "Entity",
    field: "entity_name",
    sortable: true,
    filter: true
  },
  {
    headerName: "Strategy",
    field: "strategy_name",
    sortable: true,
    filter: true
  },
  {
    headerName: "Instrument",
    field: "instrument",
    sortable: true,
    filter: true
  }
];
