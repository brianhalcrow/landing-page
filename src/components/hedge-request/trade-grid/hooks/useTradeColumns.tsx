import { ColDef } from 'ag-grid-community';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React from 'react';

interface DatePickerCellRendererProps {
  value: string;
  node: any;
  column: any;
}

const DatePickerCellRenderer: React.FC<DatePickerCellRendererProps> = (props) => {
  const { value, node, column } = props;
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log('Selected date:', date);
      const formattedDate = format(date, 'dd/MM/yyyy');
      console.log('Formatted date:', formattedDate);
      node.setDataValue(column.colId, formattedDate);
    }
  };

  const parseDate = (dateString: string) => {
    try {
      if (!dateString) return undefined;
      return parse(dateString, 'dd/MM/yyyy', new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  };

  return (
    <div className="flex items-center justify-between p-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value || "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={parseDate(value)}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const useTradeColumns = (): ColDef[] => {
  return [
    {
      field: 'base_currency',
      headerName: 'Base Currency',
      editable: true,
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
    },
    {
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: true,
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: false,
      cellRenderer: DatePickerCellRenderer,
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: false,
      cellRenderer: DatePickerCellRenderer,
    },
    {
      field: 'buy_sell',
      headerName: 'Buy/Sell',
      editable: true,
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