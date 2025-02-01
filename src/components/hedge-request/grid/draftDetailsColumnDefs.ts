import { ColDef } from 'ag-grid-community';

export const draftDetailsColumnDefs: ColDef[] = [
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
    field: 'exposure_category_l1', 
    headerName: 'Exposure L1', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'exposure_category_l2', 
    headerName: 'Exposure L2', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'exposure_category_l3', 
    headerName: 'Exposure L3', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'strategy', 
    headerName: 'Strategy', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'instrument', 
    headerName: 'Instrument', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  }
];