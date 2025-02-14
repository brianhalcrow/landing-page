
import { ColDef } from 'ag-grid-community';
import CheckboxCellRenderer from '../../grid/cellRenderers/CheckboxCellRenderer';
import { HedgeStrategyGridRow } from '../types/hedgeStrategy.types';

export const createColumnDefs = (
  handleAssignmentChange: (checked: boolean, data: HedgeStrategyGridRow) => void
): ColDef[] => [
  {
    field: 'entity_name',
    headerName: 'Entity',
    width: 150,
    rowGroup: true,
    hide: true
  },
  {
    field: 'exposure_category_l2',
    headerName: 'Exposure Category',
    width: 150,
    rowGroup: true,
    hide: true
  },
  {
    field: 'strategy_name',
    headerName: 'Strategy',
    width: 150
  },
  {
    field: 'strategy_description',
    headerName: 'Description',
    width: 200
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    width: 120
  },
  {
    field: 'counterparty_name',
    headerName: 'Counterparty',
    width: 150
  },
  {
    field: 'isAssigned',
    headerName: 'Assigned',
    width: 100,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      onChange: handleAssignmentChange
    }
  }
];
