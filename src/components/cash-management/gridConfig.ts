import { ColDef } from 'ag-grid-enterprise';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity_id',
      headerName: 'Entity ID',
      width: 120,
      sort: 'asc',
    },
    {
      field: 'entity',
      headerName: 'Entity',
      width: 200,
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      width: 120,
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100,
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 120,
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      width: 150,
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
  floatingFilter: true,
};
