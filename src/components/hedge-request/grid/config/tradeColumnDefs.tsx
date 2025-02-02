import { ColDef } from 'ag-grid-community';
import { SaveActionRenderer } from '../components/SaveActionRenderer';

export const createTradeColumnDefs = (): ColDef[] => [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 100,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false,
    valueFormatter: (params) => {
      return params.value ? `#${params.value}` : '';
    }
  },
  {
    field: 'draft_id',
    headerName: 'Draft ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'base_currency',
    headerName: 'Base Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'quote_currency',
    headerName: 'Quote Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'currency_pair',
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
  },
  {
    field: 'buy_sell',
    headerName: 'Buy/Sell',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'buy_sell_currency_code',
    headerName: 'Buy/Sell Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'buy_sell_amount',
    headerName: 'Amount',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return params.value.toLocaleString();
      }
      return '';
    }
  },
  {
    headerName: 'Actions',
    minWidth: 100,
    flex: 0.5,
    headerClass: 'ag-header-center',
    cellRenderer: SaveActionRenderer,
    editable: false,
    sortable: false,
    filter: false
  }
];