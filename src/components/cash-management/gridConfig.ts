
import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity',
      headerName: 'Entity',
      rowGroup: true,
      hide: true,
      enableRowGroup: true
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 150,
      enableRowGroup: false
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      width: 130,
      enableRowGroup: false
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name',
      width: 200,
      enableRowGroup: false
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      width: 150,
      enableRowGroup: false
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100,
      enableRowGroup: false
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
      enableRowGroup: false,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      }
    }
  ];
};

export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressSizeToFit: false,
  floatingFilter: true
};

export const autoGroupColumnDef = {
  headerName: 'Entity',
  minWidth: 250,
  cellRendererParams: {
    suppressCount: false
  }
};
