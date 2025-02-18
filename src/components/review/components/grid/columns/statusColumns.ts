
import { ColDef } from "ag-grid-enterprise";
import { format } from "date-fns";

export const createStatusColumns = (): ColDef[] => [
  {
    headerName: "Status",
    field: "status",
    sortable: true,
    filter: true,
    cellStyle: (params) => {
      switch (params.value) {
        case 'Approved':
          return { color: '#22c55e' };
        case 'Rejected':
          return { color: '#ef4444' };
        case 'Reviewed':
          return { color: '#3b82f6' };
        default:
          return null;
      }
    }
  },
  {
    headerName: "Submitted By",
    field: "submitted_by",
    sortable: true,
    filter: true
  },
  {
    headerName: "Submitted At",
    field: "submitted_at",
    sortable: true,
    filter: true,
    valueFormatter: (params) => {
      return params.value ? format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss') : '';
    }
  }
];
