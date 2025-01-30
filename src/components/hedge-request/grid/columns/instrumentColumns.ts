import { ColDef } from 'ag-grid-community';

export const instrumentColumns: ColDef[] = [
  {
    field: 'instrument',
    headerName: 'Instrument',
    width: 120,
    editable: true,
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    width: 120,
    editable: true,
  }
];