
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, addMonths } from "date-fns";
import { useState, useEffect } from "react";

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
  onDateChange
}: HeaderControlsProps) => {
  const [startInputValue, setStartInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');

  const formatMonthInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length >= 4) {
      const month = digitsOnly.substring(0, 2);
      const year = digitsOnly.substring(2, 4);
      return `${month}-${year}`;
    }
    return digitsOnly;
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formattedValue = formatMonthInput(raw);
    setStartInputValue(formattedValue);
    
    if (formattedValue.length === 5) {
      const [month, year] = formattedValue.split('-');
      const startDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      onDateChange(startDate);
      
      // Calculate and set end date (11 months later)
      const endDate = addMonths(startDate, 11);
      const endMonth = format(endDate, 'MM');
      const endYear = format(endDate, 'yy');
      setEndInputValue(`${endMonth}-${endYear}`);
    } else {
      onDateChange(undefined);
      setEndInputValue('');
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formattedValue = formatMonthInput(raw);
    setEndInputValue(formattedValue);
  };

  // Update end date when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const endDate = addMonths(selectedDate, 11);
      const endMonth = format(endDate, 'MM');
      const endYear = format(endDate, 'yy');
      setEndInputValue(`${endMonth}-${endYear}`);
    }
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2 mb-6">
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
            onChange={e => onHedgeLayerChange(e.target.value)} 
            placeholder="Enter %" 
            min="0" 
            max="100" 
            step="1" 
            className="pr-0" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Month</label>
        <Input 
          type="text" 
          placeholder="MMYY" 
          maxLength={5} 
          onChange={handleStartMonthChange} 
          value={startInputValue} 
          className="text-left" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End Month</label>
        <Input 
          type="text" 
          placeholder="MMYY" 
          maxLength={5}
          value={endInputValue}
          onChange={handleEndMonthChange}
          className="text-left"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge Ratio %</label>
        <div className="relative">
          <Input 
            type="number" 
            value={hedgeRatio} 
            onChange={e => onHedgeRatioChange(e.target.value)} 
            placeholder="Enter %" 
            min="0" 
            max="100" 
            step="1" 
            className="pr-0" 
          />
        </div>
      </div>
    </div>
  );
};
