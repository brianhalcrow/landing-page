import { ColDef } from 'ag-grid-community';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isValid, parse } from 'date-fns';
import { toast } from 'sonner';
import ActionsCellRenderer from '../components/ActionsCellRenderer';

export const useTradeColumns = (rates?: Map<string, number>): ColDef[] => {
  return [
    {
      field: 'base_currency',
      headerName: 'Base\nCurrency',
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
      headerName: 'Quote\nCurrency',
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
      valueFormatter: (params) => {
        return params.value ? params.value.toFixed(4) : '';
      },
    },
    {
      field: 'trade_date',
      headerName: 'Trade\nDate',
      editable: true,
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
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        } catch (error) {
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        }
      }
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement\nDate',
      editable: true,
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
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        } catch (error) {
          toast.error('Invalid date format. Please use DD/MM/YYYY');
          return false;
        }
      }
    },
    {
      field: 'buy_amount',
      headerName: 'Buy\nAmount',
      editable: true,
      type: 'numericColumn',
    },
    {
      field: 'sell_amount',
      headerName: 'Sell\nAmount',
      editable: true,
      type: 'numericColumn',
    },
    {
      headerName: 'Actions',
      minWidth: 100,
      cellRenderer: ActionsCellRenderer,
      editable: false,
      sortable: false,
      filter: false
    }
  ];
};