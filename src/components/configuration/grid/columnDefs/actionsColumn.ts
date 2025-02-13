
import { ColDef } from 'ag-grid-community';
import ActionsCellRenderer from '../cellRenderers/ActionsCellRenderer';

export const createActionColumn = (): ColDef => ({
  headerName: 'Actions',
  minWidth: 100,
  maxWidth: 100,
  headerClass: 'ag-header-center custom-header',
  cellRenderer: ActionsCellRenderer
});
