import { ColDef } from 'ag-grid-community';
import { CurrencySelector } from '../components/CurrencySelector';
import ActionsCellRenderer from '../components/ActionsCellRenderer';

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  return [
    {
      field: 'buy_currency',
      headerName: 'Buy',
      editable: true,
      cellRenderer: CurrencySelector,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : params.newValue
    },
    {
      field: 'buy_amount',
      headerName: 'Buy Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue),
      valueFormatter: (params) => params.value ? formatNumber(params.value) : ''
    },
    {
      field: 'sell_currency',
      headerName: 'Sell',
      editable: true,
      cellRenderer: CurrencySelector,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : params.newValue
    },
    {
      field: 'sell_amount',
      headerName: 'Sell Amount',
      editable: true,
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue),
      valueFormatter: (params) => params.value ? formatNumber(params.value) : ''
    },
    {
      field: 'rate',
      headerName: 'Spot Rate',
      editable: false,
      valueFormatter: (params) => {
        if (!params.data) return '';
        const { buy_currency, sell_currency } = params.data;
        if (buy_currency && sell_currency) {
          const currencyPair = `${buy_currency}/${sell_currency}`;
          const rate = rates?.get(currencyPair);
          return rate ? formatNumber(rate) : '';
        }
        return '';
      }
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        type: 'date'
      },
      valueFormatter: (params) => params.value || '',
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        type: 'date'
      },
      valueFormatter: (params) => params.value || '',
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