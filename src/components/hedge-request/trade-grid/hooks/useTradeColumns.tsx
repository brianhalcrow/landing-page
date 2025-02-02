import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import { toStringOrNull } from '@/lib/utils';
import ActionsCellRenderer from '../components/ActionsCellRenderer';

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  return [
    {
      field: 'base_currency',
      headerName: 'Base Currency',
      editable: true,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
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
      field: 'buy_amount',
      headerName: 'Buy Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
    },
    {
      field: 'sell_amount',
      headerName: 'Sell Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
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