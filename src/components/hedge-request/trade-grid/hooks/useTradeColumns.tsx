import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import { toStringOrNull } from '@/lib/utils';
import ActionsCellRenderer from '../components/ActionsCellRenderer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data: baseCurrencies } = await supabase
        .from('rates')
        .select('base_currency');

      const { data: quoteCurrencies } = await supabase
        .from('rates')
        .select('quote_currency');

      const uniqueCurrencies = new Set([
        ...(baseCurrencies?.map(row => row.base_currency) || []),
        ...(quoteCurrencies?.map(row => row.quote_currency) || [])
      ]);

      return Array.from(uniqueCurrencies).sort();
    }
  });

  const CurrencySelector = (props: any) => {
    const value = props.value || '';
    
    return (
      <Select
        value={value}
        onValueChange={(newValue) => props.setValue(newValue)}
      >
        <SelectTrigger className="h-8 w-full border-0 bg-transparent focus:ring-0">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies?.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return [
    {
      field: 'buy_currency',
      headerName: 'Buy',
      editable: true,
      cellRenderer: CurrencySelector,
      cellDataType: 'text',
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
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
      valueParser: (params) => params.newValue === "" ? null : toStringOrNull(params.newValue)
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