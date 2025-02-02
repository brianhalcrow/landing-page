import { SaveActionRenderer } from '../components/SaveActionRenderer';
import { ColDef } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../types/tradeTypes';

export const tradeColumnDefs: ColDef<HedgeRequestDraftTrade>[] = [
  {
    headerName: 'Actions',
    cellRenderer: SaveActionRenderer,
    cellRendererParams: {
      context: {
        table: 'hedge_request_draft_trades'
      }
    },
    editable: false,
    filter: false,
    width: 100
  },
  {
    headerName: 'Draft ID',
    field: 'draft_id',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Base Currency',
    field: 'base_currency',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Quote Currency',
    field: 'quote_currency',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Currency Pair',
    field: 'currency_pair',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Trade Date',
    field: 'trade_date',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Settlement Date',
    field: 'settlement_date',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Buy/Sell',
    field: 'buy_sell',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Buy/Sell Currency Code',
    field: 'buy_sell_currency_code',
    editable: true,
    filter: true,
    width: 150
  },
  {
    headerName: 'Buy/Sell Amount',
    field: 'buy_sell_amount',
    editable: true,
    filter: true,
    width: 150
  }
];
