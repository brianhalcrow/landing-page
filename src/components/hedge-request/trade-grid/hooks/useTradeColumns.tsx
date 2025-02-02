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

    if (!node) {
      console.error('No grid node available');
      return;
    }

    if (!column?.colId) {
      console.error('No column ID available');
      return;
    }

    if (!api) {
      console.error('No grid API available');
      return;
    }

    try {
      // Ensure date is at noon to avoid timezone issues
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);
      
      const formattedDate = format(normalizedDate, 'yyyy-MM-dd');
      console.log('Attempting to update with formatted date:', formattedDate);

      // Get the current row data
      const rowData = node.data;
      console.log('Current row data:', rowData);

      // Update the value directly using setDataValue
      if (node.setDataValue) {
        console.log('Updating via setDataValue');
        node.setDataValue(column.colId, formattedDate);
      } else {
        console.log('Falling back to transaction update');
        const updatedData = { ...rowData };
        updatedData[column.colId] = formattedDate;
        
        api.applyTransaction({
          update: [updatedData]
        });
      }

      // Force cell refresh
      api.refreshCells({
        force: true,
        rowNodes: [node],
        columns: [column.colId]
      });

      console.log('Update complete:', {
        colId: column.colId,
        newValue: formattedDate,
        rowId: node.id
      });

      setIsOpen(false);
      toast.success('Date updated successfully');
      
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
          <div className="p-0">
            <CalendarComponent
              mode="single"
              selected={currentDate}
              onSelect={(date: Date | undefined) => {
                console.log('Calendar onSelect triggered with date:', date);
                // Force the date to be at noon to avoid timezone issues
                if (date) {
                  const adjustedDate = new Date(date);
                  adjustedDate.setHours(12, 0, 0, 0);
                  console.log('Adjusted date:', adjustedDate);
                  handleDateSelect(adjustedDate);
                }
              }}
              fromDate={new Date(2000, 0, 1)}
              toDate={new Date(2050, 11, 31)}
              initialFocus
              disabled={false}
              footer={
                <div className="p-2 text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const today = new Date();
                      today.setHours(12, 0, 0, 0);
                      console.log('Setting today:', today);
                      handleDateSelect(today);
                    }}
                  >
                    Today
                  </Button>
                </div>
              }
            />
          </div>
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
      cellRendererParams: (params: any) => ({
        suppressKeyboardEvent: () => true,
        api: params.api,
        context: params.context
      }),
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
