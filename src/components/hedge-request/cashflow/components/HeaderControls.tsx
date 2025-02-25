import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface HeaderControlsProps {
  hedgeLayer: string;
  hedgeRatio: string;
  selectedDate: Date | undefined;
  onHedgeLayerChange: (value: string) => void;
  onHedgeRatioChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

export const HeaderControls = ({
  hedgeLayer,
  hedgeRatio,
  selectedDate,
  onHedgeLayerChange,
  onHedgeRatioChange,
  onDateChange,
}: HeaderControlsProps) => {
  const currentMonth = format(new Date(), "MM-yy");
  
  return (
    <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-6">
      <div></div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Layer Number</label>
        <Select>
          <SelectTrigger className="text-left">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Layer %</label>
        <div className="relative">
          <Input 
            type="number" 
            value={hedgeLayer}
            onChange={(e) => onHedgeLayerChange(e.target.value)}
            placeholder="Enter %"
            min="0"
            max="100"
            step="1"
            className="pr-6"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Month</label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {selectedDate ? format(selectedDate, "MM-yy") : currentMonth}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              fromMonth={new Date()}
              defaultMonth={new Date()}
              showOutsideDays={false}
              ISOWeek={false}
              captionLayout="dropdown-buttons"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                table: "w-full border-collapse space-y-1",
                head_row: "hidden",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge Ratio</label>
        <div className="relative">
          <Input 
            type="number" 
            value={hedgeRatio}
            onChange={(e) => onHedgeRatioChange(e.target.value)}
            placeholder="Enter %"
            min="0"
            max="100"
            step="1"
            className="pr-6"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </div>
    </div>
  );
};
