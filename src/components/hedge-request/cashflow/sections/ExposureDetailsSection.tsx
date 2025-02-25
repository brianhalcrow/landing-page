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
import { format, addMonths } from "date-fns";
import { useState, useEffect, KeyboardEvent, useRef } from "react";

const ExposureDetailsSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [revenues, setRevenues] = useState<Record<number, number>>({});
  const [costs, setCosts] = useState<Record<number, number>>({});
  const [forecasts, setForecasts] = useState<Record<number, number>>({});
  const [hedgeRatio, setHedgeRatio] = useState<string>('');
  const [hedgeLayer, setHedgeLayer] = useState<string>('');
  const [hedgeAmounts, setHedgeAmounts] = useState<Record<number, number>>({});
  const [hedgedExposures, setHedgedExposures] = useState<Record<number, number>>({});
  const [indicativeCoverage, setIndicativeCoverage] = useState<Record<number, number>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getMonths = (startDate: Date | undefined) => {
    if (!startDate) return Array(12).fill('');
    
    return Array.from({ length: 12 }, (_, i) => {
      const date = addMonths(startDate, i);
      return format(date, 'MM/yy');
    });
  };

  const months = getMonths(selectedDate);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  useEffect(() => {
    const newForecasts: Record<number, number> = {};
    months.forEach((_, index) => {
      const revenue = revenues[index] || 0;
      const cost = costs[index] || 0;
      newForecasts[index] = revenue + cost;
    });
    setForecasts(newForecasts);
  }, [revenues, costs]);

  useEffect(() => {
    const ratio = parseFloat(hedgeRatio) || 0;
    const layerPercent = parseFloat(hedgeLayer) || 0;
    const newHedgedExposures: Record<number, number> = {};
    const newHedgeAmounts: Record<number, number> = {};
    const newIndicativeCoverage: Record<number, number> = {};

    months.forEach((_, index) => {
      const forecast = forecasts[index] || 0;
      
      const hedgedExposure = (forecast * ratio) / 100;
      newHedgedExposures[index] = hedgedExposure;
      
      const hedgeAmount = (hedgedExposure * layerPercent) / 100;
      newHedgeAmounts[index] = hedgeAmount;
      
      newIndicativeCoverage[index] = forecast !== 0 ? (hedgeAmount / forecast) * 100 : 0;
    });

    setHedgedExposures(newHedgedExposures);
    setHedgeAmounts(newHedgeAmounts);
    setIndicativeCoverage(newIndicativeCoverage);
  }, [forecasts, hedgeRatio, hedgeLayer]);

  const handleRevenueChange = (index: number, value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      setRevenues(prev => ({
        ...prev,
        [index]: numericValue
      }));
    }
  };

  const handleCostChange = (index: number, value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      const negativeValue = Math.abs(numericValue) * -1;
      setCosts(prev => ({
        ...prev,
        [index]: negativeValue
      }));
    }
  };

  const handleHedgeRatioChange = (value: string) => {
    if (value === '') {
      setHedgeRatio('');
      return;
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      if (numericValue >= 0) {
        setHedgeRatio(String(Math.min(100, numericValue)));
      }
    }
  };

  const handleHedgeLayerChange = (value: string) => {
    if (value === '') {
      setHedgeLayer('');
      return;
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      if (numericValue >= 0) {
        setHedgeLayer(String(Math.min(100, numericValue)));
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const currentInput = event.currentTarget;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        const upInput = inputRefs.current[colIndex];
        if (upInput) upInput.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const downInput = inputRefs.current[colIndex + 12];
        if (downInput) downInput.focus();
        break;
      case 'ArrowLeft':
        if (currentInput.selectionStart === 0) {
          event.preventDefault();
          const prevInput = inputRefs.current[rowIndex * 12 + colIndex - 1];
          if (prevInput) prevInput.focus();
        }
        break;
      case 'ArrowRight':
        if (currentInput.selectionStart === currentInput.value.length) {
          event.preventDefault();
          const nextInput = inputRefs.current[rowIndex * 12 + colIndex + 1];
          if (nextInput) nextInput.focus();
        }
        break;
    }
  };

  const baseInputStyles = "text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="space-y-6">
      <div className="flex gap-8 mb-6">
        <div className="flex gap-4">
          <div className="w-[120px] space-y-2">
            <label className="text-sm font-medium">Layer Number</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select layer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[120px] space-y-2">
            <label className="text-sm font-medium">Layer %</label>
            <div className="relative">
              <Input 
                type="number" 
                value={hedgeLayer}
                onChange={(e) => handleHedgeLayerChange(e.target.value)}
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

        <div className="w-[120px] space-y-2">
          <label className="text-sm font-medium">Start Month</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? format(selectedDate, "MMM yyyy") : "Select month"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                fromMonth={new Date()}
                defaultMonth={new Date()}
                showOutsideDays={false}
                ISOWeek={false}
                captionLayout="dropdown-buttons"
                formatters={{ formatCaption: () => '' }}
                classNames={{
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
                  cell: "text-center text-sm p-0 relative",
                  day: cn(
                    "h-9 w-9 p-0 font-normal",
                    "hidden"
                  ),
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-[120px] space-y-2">
          <label className="text-sm font-medium">Hedge Ratio</label>
          <div className="relative">
            <Input 
              type="number" 
              value={hedgeRatio}
              onChange={(e) => handleHedgeRatioChange(e.target.value)}
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

      <div>
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div></div>
          {months.map((month) => (
            <div key={month} className="text-sm font-medium text-center">
              {month}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Revenues</div>
            <div className="text-xs text-gray-600">Long</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <Input 
              key={i}
              type="text"
              className={baseInputStyles}
              value={revenues[i] ? formatNumber(revenues[i]) : ''}
              onChange={(e) => handleRevenueChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 0, i)}
              ref={el => inputRefs.current[i] = el}
            />
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Costs</div>
            <div className="text-xs text-gray-600">(Short)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <Input 
              key={i}
              type="text"
              className={baseInputStyles}
              value={costs[i] ? formatNumber(costs[i]) : ''}
              onChange={(e) => handleCostChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 1, i)}
              ref={el => inputRefs.current[i + 12] = el}
              onFocus={(e) => {
                if (!e.target.value) {
                  e.target.value = '-';
                }
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Forecast Exposures</div>
            <div className="text-xs text-gray-600">Long/(Short)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatNumber(forecasts[i] || 0)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Hedged Exposure</div>
            <div className="text-xs text-gray-600">Long/(Short)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatNumber(hedgedExposures[i] || 0)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Hedge Layer Amount</div>
            <div className="text-xs text-gray-600">Buy/(Sell)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatNumber(hedgeAmounts[i] || 0)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div className="text-sm font-medium">Indicative Coverage</div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatPercentage(indicativeCoverage[i] || 0)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div className="text-sm font-medium">Cum. Hedge Layer Amounts</div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatNumber(0)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2">
          <div className="text-sm font-medium">Cum. Indicative Coverage (%)</div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              0%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExposureDetailsSection;
