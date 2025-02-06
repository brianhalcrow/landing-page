
import { ColDef } from 'ag-grid-community';

export const createBaseColumnDefs = (): ColDef[] => [
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  },
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    minWidth: 240,
    flex: 2,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'text-left pl-4'
  }
];
