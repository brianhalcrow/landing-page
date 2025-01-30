import { ColDef } from 'ag-grid-community';
import { validateAmount, validateBuySell } from '../validation';

export const tradeColumns: ColDef[] = [
  {
    field: 'buy_sell',
    headerName: 'Buy/Sell',
    width: 100,
    editable: true,
    valueSetter: validateBuySell
  },
  {
    field: 'buy_sell_currency_code',
    headerName: 'Currency Code',
    width: 120,
    editable: true,
  },
  {
    field: 'buy_sell_amount',
    headerName: 'Amount',
    width: 120,
    type: 'numericColumn',
    editable: true,
    valueSetter: validateAmount
  }
];