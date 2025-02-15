
import { ColDef } from 'ag-grid-community';
import { EntitySelector } from '../selectors/EntitySelector';
import { StrategySelector } from '../selectors/StrategySelector';
import { CounterpartySelector } from '../selectors/CounterpartySelector';
import { CostCentreSelector } from '../selectors/CostCentreSelector';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    editable: true,
    cellRenderer: EntitySelector,
    cellEditor: EntitySelector,
    cellEditorPopup: false
  },
  {
    field: 'cost_centre',
    headerName: 'Cost Centre*',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellRenderer: CostCentreSelector,
    cellEditor: CostCentreSelector,
    cellEditorPopup: false
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false,
    hide: true
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true,
    cellRenderer: StrategySelector,
    cellEditor: StrategySelector,
    cellEditorPopup: false
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
    field: 'counterparty',
    headerName: 'Counterparty',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true,
    cellRenderer: CounterpartySelector,
    cellEditor: CounterpartySelector,
    cellEditorPopup: false
  },
  {
    field: 'counterparty_name',
    headerName: 'Counterparty Name',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false,
    hide: true
  },
  {
    field: 'buy_sell',
    headerName: 'Buy/Sell',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['BUY', 'SELL']
    }
  },
  {
    field: 'amount',
    headerName: 'Amount',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    type: 'numericColumn'
  },
  {
    field: 'currency',
    headerName: 'Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']
    }
  },
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agDateCellEditor',
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toISOString().split('T')[0];
    }
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agDateCellEditor',
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toISOString().split('T')[0];
    }
  }
];
