import { ColDef } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'instrument', 
    headerName: 'Instrument', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'strategy', 
    headerName: 'Strategy', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'base_currency', 
    headerName: 'Base Currency', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'quote_currency', 
    headerName: 'Quote Currency', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'currency_pair', 
    headerName: 'Currency Pair', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'trade_date', 
    headerName: 'Trade Date', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    valueFormatter: (params) => {
      if (params.value) {
        return new Date(params.value).toLocaleDateString();
      }
      return '';
    }
  },
  { 
    field: 'settlement_date', 
    headerName: 'Settlement Date', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    valueFormatter: (params) => {
      if (params.value) {
        return new Date(params.value).toLocaleDateString();
      }
      return '';
    }
  },
  { 
    field: 'buy_sell', 
    headerName: 'Buy/Sell', 
    minWidth: 100,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'buy_sell_currency_code', 
    headerName: 'B/S Currency', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center'
  },
  { 
    field: 'buy_sell_amount', 
    headerName: 'Amount', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    valueFormatter: (params) => {
      if (params.value) {
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      return '';
    }
  }
];