
import { ColDef } from 'ag-grid-community';
import { CurrencyCellEditor } from '../components/CurrencyCellEditor';
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
      cellEditor: CurrencyCellEditor,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : params.newValue,
      cellStyle: { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
      }
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
      }
    },
    {
      field: 'sell_currency',
      headerName: 'Sell',
      editable: true,
      cellEditor: CurrencyCellEditor,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : params.newValue,
      cellStyle: { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
      }
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
    }
  ];
};
