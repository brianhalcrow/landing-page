import { ColDef } from 'ag-grid-community';
import { CurrencySelector } from '../components/CurrencySelector';
import ActionsCellRenderer from '../components/ActionsCellRenderer';
import { shouldAllowAmountEdit } from '../utils/amountValidation';

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const useTradeColumns = (
  rates?: Map<string, number>,
  lastSelectedCurrency?: 'buy' | 'sell' | null
): ColDef[] => {
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
      editable: (params) => shouldAllowAmountEdit(params, 'buy', lastSelectedCurrency),
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue),
      valueFormatter: (params) => params.value ? formatNumber(params.value) : '',
      cellStyle: (params) => {
        const isEditable = shouldAllowAmountEdit(params, 'buy', lastSelectedCurrency);
        if (params.data?.buy_currency) {
          return { 
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1px dashed rgb(234, 179, 8)',
            transition: 'all 0.2s ease-in-out',
            cursor: isEditable ? 'pointer' : 'not-allowed',
            opacity: isEditable ? 1 : 0.7
          };
        }
        return {};
      },
      cellClass: (params) => {
        return params.data?.buy_currency ? 'cursor-pointer hover:bg-yellow-100' : '';
      },
      suppressKeyboardEvent: (params) => {
        return !shouldAllowAmountEdit(params, 'buy', lastSelectedCurrency);
      }
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
      editable: (params) => shouldAllowAmountEdit(params, 'sell', lastSelectedCurrency),
      cellDataType: 'number',
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue),
      valueFormatter: (params) => params.value ? formatNumber(params.value) : '',
      cellStyle: (params) => {
        const isEditable = shouldAllowAmountEdit(params, 'sell', lastSelectedCurrency);
        if (params.data?.sell_currency) {
          return { 
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1px dashed rgb(234, 179, 8)',
            transition: 'all 0.2s ease-in-out',
            cursor: isEditable ? 'pointer' : 'not-allowed',
            opacity: isEditable ? 1 : 0.7
          };
        }
        return {};
      },
      cellClass: (params) => {
        return params.data?.sell_currency ? 'cursor-pointer hover:bg-yellow-100' : '';
      },
      suppressKeyboardEvent: (params) => {
        return !shouldAllowAmountEdit(params, 'sell', lastSelectedCurrency);
      }
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
