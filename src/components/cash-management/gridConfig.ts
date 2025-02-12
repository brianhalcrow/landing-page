
import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity',
      headerName: 'Entity',
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      rowGroup: true,
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 150,
      enableRowGroup: false,
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name',
      width: 200,
      enableRowGroup: false,
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
  floatingFilter: true,
};

export const autoGroupColumnDef = {
  headerName: 'Bank Accounts',
  minWidth: 300,
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      const field = params.node.field || '';
      const value = params.value || '';
      return value;
    }
  }
};
