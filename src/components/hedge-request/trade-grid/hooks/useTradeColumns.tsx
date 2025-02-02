import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import { toStringOrNull } from '@/lib/utils';
import ActionsCellRenderer from '../components/ActionsCellRenderer';

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  return [
    {
      field: 'base_currency',
      headerName: 'Buy',
      editable: true,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
    },
    {
      field: 'buy_amount',
      headerName: 'Buy Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
    },
    {
      field: 'quote_currency',
      headerName: 'Sell',
      editable: true,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
    },
    {
      field: 'sell_amount',
      headerName: 'Sell Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
    },
    {
      field: 'rate',
      headerName: 'Spot Rate',
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) {
          const { base_currency, quote_currency } = params.data;
          if (base_currency && quote_currency) {
            const currencyPair = `${base_currency}/${quote_currency}`;
            return rates?.get(currencyPair)?.toString() || '';
          }
        }
        return params.value;
      }
    },
    {
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: false
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      valueFormatter: (params) => {
        return params.value ? format(new Date(params.value), 'dd/MM/yyyy') : '';
      }
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      valueFormatter: (params) => {
        return params.value ? format(new Date(params.value), 'dd/MM/yyyy') : '';
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      editable: false,
      sortable: false,
      filter: false,
      width: 100
    }
  ];
};