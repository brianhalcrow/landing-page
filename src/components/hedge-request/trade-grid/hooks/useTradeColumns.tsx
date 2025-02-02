import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';
import { toStringOrNull } from '@/lib/utils';
import ActionsCellRenderer from '../components/ActionsCellRenderer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  // Fetch unique currency codes from rates table
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data: baseCurrencies, error: baseError } = await supabase
        .from('rates')
        .select('base_currency')
        .then(result => ({
          data: result.data?.map(row => row.base_currency).filter(Boolean),
          error: result.error
        }));

      const { data: quoteCurrencies, error: quoteError } = await supabase
        .from('rates')
        .select('quote_currency')
        .then(result => ({
          data: result.data?.map(row => row.quote_currency).filter(Boolean),
          error: result.error
        }));

      if (baseError || quoteError) {
        console.error('Error fetching currencies:', baseError || quoteError);
        return [];
      }

      const uniqueCurrencies = new Set([
        ...(baseCurrencies || []),
        ...(quoteCurrencies || [])
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
      field: 'base_currency',
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
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
    },
    {
      field: 'quote_currency',
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
      valueParser: (params) => params.newValue === "" ? null : Number(params.newValue)
    },
    {
      field: 'rate',
      headerName: 'Spot Rate',
      editable: false,
      valueFormatter: (params) => {
        const { base_currency, quote_currency } = params.data;
        if (base_currency && quote_currency) {
          const currencyPair = `${base_currency}/${quote_currency}`;
          return rates?.get(currencyPair)?.toString() || '';
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