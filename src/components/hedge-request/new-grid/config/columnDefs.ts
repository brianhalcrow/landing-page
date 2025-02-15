
import { ColDef } from 'ag-grid-community';
import { EntitySelector } from '../selectors/EntitySelector';
import { StrategySelector } from '../selectors/StrategySelector';
import { CounterpartySelector } from '../selectors/CounterpartySelector';
import { CostCentreSelector } from '../selectors/CostCentreSelector';
import { format } from 'date-fns';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellRenderer: EntitySelector
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    editable: false
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
    field: 'strategy_name',
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
    field: 'counterparty_name',
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
    field: 'buy_currency',
    headerName: 'Buy CCY',
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
    field: 'buy_amount',
    headerName: 'Buy Amount',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    type: 'numericColumn',
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(params.value);
    }
  },
  {
    field: 'sell_currency',
    headerName: 'Sell CCY',
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
    field: 'sell_amount',
    headerName: 'Sell Amount',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    type: 'numericColumn',
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(params.value);
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
    cellEditorParams: {
      useCellRendererInPopup: true
    },
    valueFormatter: (params) => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return format(date, 'dd/MM/yyyy');
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
    cellEditorParams: {
      useCellRendererInPopup: true
    },
    valueFormatter: (params) => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return format(date, 'dd/MM/yyyy');
    }
  }
];
