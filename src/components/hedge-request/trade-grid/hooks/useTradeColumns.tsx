import { ColDef } from 'ag-grid-community';
import { Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface DatePickerCellRendererProps {
  value?: string;
  node?: any;
  column?: any;
  api?: any;
}

const DatePickerCellRenderer: React.FC<DatePickerCellRendererProps> = (props) => {
  const { value, node, column, api } = props;

  useEffect(() => {
    // Log component initialization
    console.log('DatePickerCellRenderer initialized:', {
      value,
      nodeId: node?.id,
      columnId: column?.colId,
      hasSetDataValue: !!node?.setDataValue
    });
  }, [value, node, column]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    try {
      if (!date) {
        console.log('No date selected');
        return;
      }

      if (!isValid(date)) {
        console.error('Invalid date object:', date);
        toast.error('Invalid date selected');
        return;
      }

      // Format date as YYYY-MM-DD for storage
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Log the update attempt
      console.log('Attempting to update cell:', {
        date,
        formattedDate,
        columnId: column?.colId,
        nodeId: node?.id,
        hasNode: !!node,
        hasSetDataValue: !!node?.setDataValue,
        hasApi: !!api
      });

      // Try different methods to update the cell
      if (node?.setDataValue) {
        // Method 1: Direct node update
        node.setDataValue(column.colId, formattedDate);
        console.log('Updated via setDataValue');
      } else if (api?.applyTransaction) {
        // Method 2: Grid transaction
        const rowNode = api.getRowNode(node.id);
        if (rowNode) {
          api.applyTransaction({
            update: [{
              ...rowNode.data,
              [column.colId]: formattedDate
            }]
          });
          console.log('Updated via applyTransaction');
        }
      } else {
        console.error('No valid update method available');
        toast.error('Unable to update grid value');
        return;
      }

      // Force refresh the grid cell
      if (api?.refreshCells) {
        api.refreshCells({
          force: true,
          rowNodes: [node],
          columns: [column.colId]
        });
        console.log('Refreshed cells');
      }

      toast.success('Date updated successfully');
    } catch (error) {
      console.error('Error in handleDateSelect:', error);
      toast.error('Error updating date');
    }
  }, [node, column, api]);

  const parseDate = useCallback((dateString: string | undefined): Date | undefined => {
    try {
      if (!dateString) {
        console.log('No date string provided');
        return undefined;
      }

      // Try parsing YYYY-MM-DD format first
      let parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      
      if (!isValid(parsedDate)) {
        // Try DD/MM/YYYY format as fallback
        parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      }

      if (!isValid(parsedDate)) {
        console.log('Invalid parsed date for:', dateString);
        return undefined;
      }

      return parsedDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  }, []);

  const currentDate = parseDate(value);
  const displayDate = currentDate && isValid(currentDate) 
    ? format(currentDate, 'dd/MM/yyyy') 
    : 'Select date';

  return (
    <div className="flex items-center justify-between p-1">
      <Popover onOpenChange={(open) => {
        console.log('Popover state changed:', { open, columnId: column?.colId });
      }}>
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
            selected={currentDate}
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
