
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
      <HoverCardContent className="p-0" side="right">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
      </HoverCardContent>
    </HoverCard>
  );
};
