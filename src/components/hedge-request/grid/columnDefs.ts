import { ColDef } from 'ag-grid-community';
import { validateDate, validateAmount, validateBuySell } from './validation';

export const getColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    width: 110,
    editable: true,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      required: true,
    }
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    width: 200,
    editable: true,
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    width: 120,
    editable: true,
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    width: 120,
    editable: true,
  },
  {
    field: 'base_currency',
    headerName: 'Base Currency',
    width: 120,
    editable: true,
  },
  {
    field: 'quote_currency',
    headerName: 'Quote Currency',
    width: 120,
    editable: true,
  },
  {
    field: 'currency_pair',
    headerName: 'Currency Pair',
    width: 120,
    editable: false,
    valueGetter: (params) => {
      const base = params.data?.base_currency;
      const quote = params.data?.quote_currency;
      return base && quote ? `${base}/${quote}` : '';
    }
  },
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    width: 120,
    editable: true,
    valueSetter: validateDate
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    width: 120,
    editable: true,
    valueSetter: (params) => {
      if (!validateDate(params)) return false;
      
      const tradeDate = new Date(params.data.trade_date);
      const settlementDate = new Date(params.newValue);
      
      if (settlementDate <= tradeDate) {
        toast({
          title: "Invalid Settlement Date",
          description: "Settlement date must be after trade date",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
  },
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