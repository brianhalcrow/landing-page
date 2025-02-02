import { ColDef } from 'ag-grid-community';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parse, isValid } from 'date-fns';
import { toast } from 'sonner';

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
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: false,
    },
    {
      field: 'rate',
      headerName: 'Rate',
      editable: false,
      valueFormatter: (params) => {
        return params.value ? params.value.toFixed(4) : '';
      },
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => {
        if (!params.value) return '';
        try {
          const date = parse(params.value, 'yyyy-MM-dd', new Date());
          return isValid(date) ? format(date, 'dd/MM/yyyy') : params.value;
        } catch (error) {
          return params.value;
        }
      },
      valueSetter: (params) => {
        try {
          // Try to parse the input value as a date
          const inputDate = parse(params.newValue, 'dd/MM/yyyy', new Date());
          if (isValid(inputDate)) {
            // If valid, store in YYYY-MM-DD format
            params.data[params.column.getColId()] = format(inputDate, 'yyyy-MM-dd');
            return true;
          }
          // If invalid, store the raw input
          params.data[params.column.getColId()] = params.newValue;
          return true;
        } catch (error) {
          console.error('Error setting date:', error);
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        }
      }
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => {
        if (!params.value) return '';
        try {
          const date = parse(params.value, 'yyyy-MM-dd', new Date());
          return isValid(date) ? format(date, 'dd/MM/yyyy') : params.value;
        } catch (error) {
          return params.value;
        }
      },
      valueSetter: (params) => {
        try {
          const inputDate = parse(params.newValue, 'dd/MM/yyyy', new Date());
          if (isValid(inputDate)) {
            params.data[params.column.getColId()] = format(inputDate, 'yyyy-MM-dd');
            return true;
          }
          params.data[params.column.getColId()] = params.newValue;
          return true;
        } catch (error) {
          console.error('Error setting date:', error);
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        }
      }
    },
    {
      field: 'buy_sell',
      headerName: 'Buy/Sell',
      editable: true,
      cellRenderer: (params: any) => (
        <Select
          value={params.value}
          onValueChange={(value) => {
            params.setValue(value);
          }}
        >
          <SelectTrigger className="w-full h-8 border-0">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUY">BUY</SelectItem>
            <SelectItem value="SELL">SELL</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      field: 'buy_sell_currency_code',
      headerName: 'Buy/Sell Currency',
      editable: true,
    },
    {
      field: 'buy_sell_amount',
      headerName: 'Amount',
      editable: true,
      type: 'numericColumn',
    },
  ];
};