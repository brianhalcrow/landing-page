import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity',
      headerName: 'Entity',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100,
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      width: 150,
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 120,
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name',
      width: 200,
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
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
  minWidth: 250,
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      return params.value;
    }
  }
};
