import { ColDef } from 'ag-grid-community';

export const entityColumns: ColDef[] = [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    width: 110,
    editable: true,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      required: true,
    }
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    width: 200,
    editable: true,
  }
];