import { ColDef } from 'ag-grid-community';

export const getColumnDefs = (): ColDef[] => [
  { 
    field: 'entity_name',
    headerName: 'Entity Name',
    flex: 2,
    minWidth: 200,
  },
  { 
    field: 'entity_id',
    headerName: 'Entity ID',
    flex: 1,
    minWidth: 100,
  },
  { 
    field: 'functional_currency',
    headerName: 'Functional Currency',
    flex: 1,
    minWidth: 120,
  },
  { 
    field: 'accounting_rate_method',
    headerName: 'Accounting Rate Method',
    flex: 1.5,
    minWidth: 150,
  },
];