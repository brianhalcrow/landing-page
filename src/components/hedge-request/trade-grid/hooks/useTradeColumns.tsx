import { ColDef } from 'ag-grid-community';
import { Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface DatePickerCellRendererProps {
  value?: string;
  node?: any;
  column?: any;
  api?: any;
}

const DatePickerCellRenderer: React.FC<DatePickerCellRendererProps> = (props) => {
  const { value, node, column, api } = props;
  const [isOpen, setIsOpen] = useState(false);

  const parseDate = useCallback((dateString: string | undefined): Date | undefined => {
    if (!dateString) {
      return undefined;
    }

    // Try parsing YYYY-MM-DD format first
    let parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    
    if (!isValid(parsedDate)) {
      // Try DD/MM/YYYY format as fallback
      parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    }

    return isValid(parsedDate) ? parsedDate : undefined;
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log('handleDateSelect called with date:', date);
    
    if (!date || !isValid(date)) {
      console.log('Invalid date selected');
      return;
    }

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Formatted date:', formattedDate);

      if (node && column?.colId) {
        // Update via transaction
        const rowNode = api.getRowNode(node.id);
        if (rowNode) {
          const updatedData = { ...rowNode.data };
          updatedData[column.colId] = formattedDate;
          
          api.applyTransaction({
            update: [updatedData]
          });
          
          console.log('Updated cell via transaction:', {
            colId: column.colId,
            newValue: formattedDate,
            rowId: node.id
          });
        }
      }

      // Close the popover after selection
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error updating date:', error);
      toast.error('Failed to update date');
    }
  }, [node, column, api]);

  const currentDate = parseDate(value);
  const displayDate = currentDate ? format(currentDate, 'dd/MM/yyyy') : 'Select date';

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
            onClick={() => {
              console.log('DatePicker button clicked');
              setIsOpen(true);
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={currentDate}
            onSelect={(date: Date | undefined) => {
              console.log('Calendar onSelect triggered:', date);
              handleDateSelect(date);
            }}
            initialFocus
            disabled={false}
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
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
    },
    {
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: false,
      valueFormatter: (params) => {
        if (params.value && rates?.has(params.value)) {
          const rate = rates.get(params.value);
          return `${params.value} (Rate: ${rate?.toFixed(4)})`;
        }
        return params.value || '';
      },
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: false,
      cellRenderer: DatePickerCellRenderer,
      cellRendererParams: {
        suppressKeyboardEvent: () => true,
      },
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: false,
      cellRenderer: DatePickerCellRenderer,
      cellRendererParams: {
        suppressKeyboardEvent: () => true,
      },
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
