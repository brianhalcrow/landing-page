
import { ColDef } from 'ag-grid-community';
import { EntitySelector } from '../selectors/EntitySelector';
import { CounterpartySelector } from '../selectors/CounterpartySelector';
import { StrategySelector } from '../selectors/StrategySelector';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: EntitySelector,
    editable: false
  },
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'counterparty',
    headerName: 'Counterparty',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: CounterpartySelector,
    editable: false
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: StrategySelector,
    editable: false
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'ccy_pair',
    headerName: 'Currency Pair',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  }
];
