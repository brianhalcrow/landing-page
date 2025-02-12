import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity_id',
      headerName: 'Entity ID',
      rowGroup: true,
      hide: true,
      sort: 'asc'  // This ensures entities are sorted by country code
    },
    {
      field: 'entity',
      headerName: 'Entity Name',
      hide: true,  // Hidden because it will be shown in the group
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
  suppressSizeToFit: false,
  floatingFilter: true,
};

export const autoGroupColumnDef = {
  headerName: 'Bank Accounts By Entity',
  minWidth: 300,
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      if (params.node.group) {
        // For entity level, show both ID and name
        if (params.node.level === 0) {
          const entityId = params.node.key;
          const entityName = params.node.allLeafChildren[0].data.entity;
          return `${entityId} - ${entityName}`;
        }
        // For other levels, just show the value
        return params.value;
      }
      return params.value;
    }
  }
};
