
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateCellProps {
  value: string;
  node: any;
  column: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const DateCell = ({ value, node, column, context }: DateCellProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Only update local state when prop value changes significantly
  useEffect(() => {
    const newDate = value ? new Date(value) : undefined;
    const currentDateStr = selectedDate?.toISOString().split('T')[0];
    const newDateStr = newDate?.toISOString().split('T')[0];
    
    if (newDateStr !== currentDateStr) {
      setSelectedDate(newDate);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !context?.updateRowData) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Only update if the date has actually changed
    if (formattedDate !== value) {
      setSelectedDate(date);
      context.updateRowData(node.rowIndex, {
        [column.colDef.field]: formattedDate
      });
    }

    setOpen(false);
  };

  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        className="w-full h-full px-2 py-1 cursor-pointer text-left"
        onMouseEnter={() => setOpen(true)}
      >
        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Select date'}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        side="bottom"
        sideOffset={5}
        onMouseLeave={() => setOpen(false)}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="rounded-md border shadow bg-white p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-primary",
            nav: "space-x-1 flex items-center",
            nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-primary",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex justify-center mb-1",
            head_cell: "text-muted-foreground w-7 font-bold text-center text-[0.75rem] bg-transparent",
            row: "flex w-full mt-1 justify-center",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/20",
            day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/20 hover:text-primary text-sm",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-semibold",
            day_outside: "day-outside text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          weekStartsOn={1}
        />
      </PopoverContent>
    </Popover>
  );
};
