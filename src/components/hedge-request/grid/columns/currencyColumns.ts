import { ColDef } from 'ag-grid-community';

export const currencyColumns: ColDef[] = [
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
  }
];