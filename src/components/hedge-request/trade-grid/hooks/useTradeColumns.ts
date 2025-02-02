import { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';

export const useTradeColumns = () => {
  return useMemo<ColDef[]>(() => [
    { field: 'base_currency', headerName: 'Base Currency', editable: true },
    { field: 'quote_currency', headerName: 'Quote Currency', editable: true },
    { field: 'currency_pair', headerName: 'Currency Pair', editable: true },
    { field: 'trade_date', headerName: 'Trade Date', editable: true },
    { field: 'settlement_date', headerName: 'Settlement Date', editable: true },
    { 
      field: 'buy_sell', 
      headerName: 'Buy/Sell', 
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['BUY', 'SELL']
      }
    },
    { field: 'buy_sell_currency_code', headerName: 'Currency', editable: true },
    { field: 'buy_sell_amount', headerName: 'Amount', editable: true, type: 'numericColumn' }
  ], []);
};