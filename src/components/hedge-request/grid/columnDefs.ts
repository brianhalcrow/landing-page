import { ColDef } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'functional_currency', 
    headerName: 'Functional Currency', 
    minWidth: 150,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'cost_centre', 
    headerName: 'Cost Centre', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    minWidth: 100,
    flex: 1,
    headerClass: 'ag-header-center'
  }
];