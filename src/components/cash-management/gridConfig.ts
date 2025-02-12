
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity_name',
      headerName: 'Entity',
      pinned: 'left',
      width: 180,
      rowGroup: true,
      hide: true
    },
    { 
      field: 'transaction_currency',
      headerName: 'Currency',
      width: 100
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120
    },
    {
      field: 'month',
      headerName: 'Month',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? format(new Date(params.value), 'MMM yyyy') : '';
      }
    },
    {
      field: 'Transaction Amount',
      headerName: 'Actual',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(params.value);
        }
        return '';
      }
    },
    {
      field: 'forecast_amount',
      headerName: 'Forecast',
      width: 120,
      editable: true,
      cellClass: 'editable-cell',
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(params.value);
        }
        return '';
      }
    }
  ];
};

export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressSizeToFit: false
};

export const autoGroupColumnDef = {
  headerName: 'Entity',
  minWidth: 300,
  cellRendererParams: {
    suppressCount: true
  }
};
