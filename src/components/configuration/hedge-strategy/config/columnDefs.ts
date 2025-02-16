
import { ColDef } from 'ag-grid-enterprise';
import { HedgeStrategyGridRow } from '../types/hedgeStrategy.types';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_name',
    headerName: 'Entity',
    width: 150,
    rowGroup: true,
    hide: true
  },
  {
    field: 'strategy_name',
    headerName: 'Strategy',
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
  }
];
