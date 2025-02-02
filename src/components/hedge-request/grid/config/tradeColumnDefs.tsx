import { ColDef } from 'ag-grid-community';

export const tradeColumnDefs: ColDef[] = [
  {
    field: 'currency_pair',
    headerName: 'Currency Pair',
    flex: 1,
  },
  {
    field: 'base_currency',
    headerName: 'Base Currency',
    flex: 1,
  },
  {
    field: 'quote_currency',
    headerName: 'Quote Currency',
    flex: 1,
  },
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    flex: 1,
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    flex: 1,
  },
  {
    field: 'buy_sell',
    headerName: 'Buy/Sell',
    flex: 1,
  },
  {
    field: 'buy_sell_amount',
    headerName: 'Amount',
    flex: 1,
    type: 'numericColumn',
  },
  {
    field: 'buy_sell_currency_code',
    headerName: 'Currency',
    flex: 1,
  }
];