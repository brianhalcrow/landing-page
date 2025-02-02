import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  return [
    {
      field: 'base_currency',
      headerName: 'Base Currency',
      editable: true,
      cellRenderer: (params: any) => {
        const currencies = Array.from(new Set(Array.from(rates?.keys() || []).map(pair => pair.split('/')[0])));
        return (
          <Select
            value={params.value}
            onValueChange={(value) => {
              params.setValue(value);
            }}
          >
            <SelectTrigger className="w-full h-8 border-0">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency: string) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
      cellRenderer: (params: any) => {
        const currencies = Array.from(new Set(Array.from(rates?.keys() || []).map(pair => pair.split('/')[1])));
        return (
          <Select
            value={params.value}
            onValueChange={(value) => {
              params.setValue(value);
            }}
          >
            <SelectTrigger className="w-full h-8 border-0">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency: string) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    },
    {
      field: 'rate',
      headerName: 'Rate',
      editable: false,
      valueGetter: (params) => {
        const { base_currency, quote_currency } = params.data;
        if (base_currency && quote_currency) {
          const currencyPair = `${base_currency}/${quote_currency}`;
          return rates?.get(currencyPair);
        }
        return null;
      },
      valueFormatter: (params) => {
        return params.value ? params.value.toFixed(4) : '';
      }
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
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toFixed(2) : '';
      }
    },
    {
      field: 'sell_amount',
      headerName: 'Sell Amount',
      editable: true,
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toFixed(2) : '';
      }
    }
  ];
};