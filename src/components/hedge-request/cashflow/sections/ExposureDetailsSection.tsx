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
import { useState, useEffect } from "react";

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

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i + 2, 25);
    return date.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' });
  });

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  useEffect(() => {
    const ratio = parseFloat(hedgeRatio) || 0;
    const layer = parseFloat(hedgeLayer) || 0;
    const newHedgeAmounts: Record<number, number> = {};
    const newIndicativeCoverage: Record<number, number> = {};
    const newHedgedExposures: Record<number, number> = {};

    months.forEach((_, index) => {
      const forecast = forecasts[index] || 0;
      const hedgeAmount = (forecast * ratio) / 100;
      newHedgeAmounts[index] = hedgeAmount;
      newHedgedExposures[index] = hedgeAmount * layer;

      // Calculate indicative coverage
      newIndicativeCoverage[index] = forecast !== 0 ? (hedgeAmount / forecast) * 100 : 0;
    });

    setHedgeAmounts(newHedgeAmounts);
    setHedgedExposures(newHedgedExposures);
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
        setHedgeLayer(String(numericValue));
      }
    }
  };

  const baseInputStyles = "text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="space-y-6">
      {/* Header Controls */}
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
            <label className="text-sm font-medium">Hedge Layer</label>
            <div className="relative">
              <Input 
                type="number" 
                value={hedgeLayer}
                onChange={(e) => handleHedgeLayerChange(e.target.value)}
                placeholder="Enter value"
                min="0"
                step="1"
                className="pr-6"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">×</span>
            </div>
          </div>
        </div>

        <div className="w-[120px] space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? format(selectedDate, "MMM yyyy") : "Select date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
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

      {/* Grid Section */}
      <div>
        {/* Month Headers */}
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div></div>
          {months.map((month) => (
            <div key={month} className="text-sm font-medium text-center">
              {month}
            </div>
          ))}
        </div>

        {/* Revenues */}
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
            />
          ))}
        </div>

        {/* Costs */}
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
              onFocus={(e) => {
                if (!e.target.value) {
                  e.target.value = '-';
                }
              }}
            />
          ))}
        </div>

        {/* Forecast Exposures */}
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Forecast Exposures</div>
            <div className="text-xs text-gray-600">Long/(Short)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <Input 
              key={i}
              type="text"
              className={baseInputStyles}
              value={forecasts[i] ? formatNumber(forecasts[i]) : '0'}
              readOnly
            />
          ))}
        </div>

        {/* Hedged Exposure */}
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

        {/* Hedge Layer Amount */}
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

        {/* Indicative Coverage */}
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div className="text-sm font-medium">Indicative Coverage</div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatPercentage(indicativeCoverage[i] || 0)}
            </div>
          ))}
        </div>

        {/* Cum. Hedge Layer Amounts */}
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2 mb-2">
          <div className="text-sm font-medium">Cum. Hedge Layer Amounts</div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              {formatNumber(0)}
            </div>
          ))}
        </div>

        {/* Cum. Indicative Coverage (%) */}
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
