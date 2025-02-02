import { ColDef } from 'ag-grid-community';
import { Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DatePickerCellRendererProps {
  value?: string;
  node?: any;
  column?: any;
  api?: any;
}

const DatePickerCellRenderer: React.FC<DatePickerCellRendererProps> = (props) => {
  const { value, node, column, api } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  );

  // Effect to handle date updates
  useEffect(() => {
    if (selectedDate && isValid(selectedDate) && node && column?.colId && api) {
      try {
        // Normalize date to noon to avoid timezone issues
        const normalizedDate = new Date(selectedDate);
        normalizedDate.setHours(12, 0, 0, 0);

        // Format for storage (YYYY-MM-DD)
        const storageFormat = format(normalizedDate, 'yyyy-MM-dd');
        console.log('Updating cell with storage format:', storageFormat);

        // Update the cell value
        node.setDataValue(column.colId, storageFormat);

        // Force refresh the cell
        api.refreshCells({
          force: true,
          rowNodes: [node],
          columns: [column.colId]
        });

        // Close popover after successful update
        setIsOpen(false);
        toast.success('Date updated successfully');
      } catch (error) {
        console.error('Error updating date:', error);
        toast.error('Failed to update date');
      }
    }
  }, [selectedDate, node, column, api]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
  }, []);

  // Parse the current value and format for display
  const displayDate = selectedDate && isValid(selectedDate) 
    ? format(selectedDate, 'dd/MM/yyyy') 
    : 'Select date';

  return (
    <div className="flex items-center justify-between p-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

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
      editable: false,
      cellRenderer: DatePickerCellRenderer,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = parse(params.value, 'yyyy-MM-dd', new Date());
        return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
      },
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: false,
      cellRenderer: DatePickerCellRenderer,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = parse(params.value, 'yyyy-MM-dd', new Date());
        return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
      },
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
