
import { ColDef } from 'ag-grid-community';

export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    width: 120,
    sort: 'asc',
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    width: 200,
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  }
];
