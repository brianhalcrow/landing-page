
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface DateCellProps {
  value: string;
  node: any;
  column: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const DateCell = ({ value, node, column, context }: DateCellProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date && context?.updateRowData) {
      context.updateRowData(node.rowIndex, {
        [column.colDef.field]: format(date, 'yyyy-MM-dd')
      });
    }
  };

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="w-full h-full px-2 py-1 cursor-pointer">
          {value ? format(new Date(value), 'dd/MM/yyyy') : 'Select date'}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-auto p-0" 
        sideOffset={5}
        align="start"
        side="bottom"
        alignOffset={-50}
        style={{
          position: 'absolute',
          zIndex: 1000
        }}
      >
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
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
      </HoverCardContent>
    </HoverCard>
  );
};
