import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity',
      headerName: 'Entity',
      rowGroup: true,  // Keep this as the primary grouping
      hide: true,
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      enableRowGroup: true,  // Remove rowGroup: true from here
      hide: false,
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      enableRowGroup: true,  // Remove rowGroup: true from here
      hide: false,
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      enableRowGroup: true,  // Remove rowGroup: true from here
      hide: false,
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
  headerName: 'Grouped By Entity',
  minWidth: 300,
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      if (!params.value) return '';
      return params.value;
    }
  }
};
};
