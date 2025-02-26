
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, addMonths, differenceInMonths, parse } from "date-fns";
import { useState, useEffect } from "react";
import { convertToDBDate, convertToDisplayFormat } from "../utils/dateTransformations";
import { toast } from "sonner";

interface HeaderControlsProps {
  hedgeLayer: string;
  hedgeRatio: string;
  selectedDate: Date | undefined;
  selectedLayerNumber: number;
  onHedgeLayerChange: (value: string) => void;
  onHedgeRatioChange: (value: string) => void;
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onLayerChange: (value: number) => void;
}

export const HeaderControls = ({
  hedgeLayer,
  hedgeRatio,
  selectedDate,
  selectedLayerNumber,
  onHedgeLayerChange,
  onHedgeRatioChange,
  onDateChange,
  onLayerChange
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

  const validateDateRange = (startDate: Date | undefined, endDate: Date | undefined): boolean => {
    if (!startDate || !endDate) return true;
    
    const monthsDiff = differenceInMonths(endDate, startDate);
    if (monthsDiff < 0) {
      toast.error("End date must be after start date");
      return false;
    }
    if (monthsDiff > 11) {
      toast.error("Date range cannot exceed 12 months");
      return false;
    }
    return true;
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formattedValue = formatMonthInput(raw);
    setStartInputValue(formattedValue);
    
    if (formattedValue.length === 5) {
      const dbStartDate = convertToDBDate(formattedValue);
      if (dbStartDate) {
        const startDate = new Date(dbStartDate);
        const dbEndDate = endInputValue.length === 5 ? convertToDBDate(endInputValue) : null;
        const endDate = dbEndDate ? new Date(dbEndDate) : undefined;
        
        if (validateDateRange(startDate, endDate)) {
          updateDates(startDate, endInputValue);
        }
      }
    } else if (!formattedValue) {
      updateDates(undefined, endInputValue);
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formattedValue = formatMonthInput(raw);
    setEndInputValue(formattedValue);
    
    if (formattedValue.length === 5) {
      const dbEndDate = convertToDBDate(formattedValue);
      if (dbEndDate) {
        const endDate = new Date(dbEndDate);
        if (startInputValue) {
          const dbStartDate = convertToDBDate(startInputValue);
          const startDate = dbStartDate ? new Date(dbStartDate) : undefined;
          
          if (validateDateRange(startDate, endDate)) {
            updateDates(startDate, formattedValue);
          }
        } else {
          updateDates(undefined, formattedValue);
        }
      }
    } else if (!formattedValue) {
      if (startInputValue) {
        const dbStartDate = convertToDBDate(startInputValue);
        const startDate = dbStartDate ? new Date(dbStartDate) : undefined;
        updateDates(startDate, undefined);
      } else {
        updateDates(undefined, undefined);
      }
    }
  };

  const updateDates = (startDate: Date | undefined, endMonthValue: string | undefined) => {
    let endDate: Date | undefined;
    
    if (endMonthValue) {
      const dbEndDate = convertToDBDate(endMonthValue);
      if (dbEndDate) {
        endDate = new Date(dbEndDate);
      }
    }
    
    onDateChange(startDate, endDate);
  };

  useEffect(() => {
    if (selectedDate) {
      const displayStart = format(selectedDate, 'MM-yy');
      setStartInputValue(displayStart);
      
      if (endInputValue) {
        const dbEndDate = convertToDBDate(endInputValue);
        if (dbEndDate) {
          const endDate = new Date(dbEndDate);
          setEndInputValue(format(endDate, 'MM-yy'));
        }
      }
    } else {
      setStartInputValue('');
      setEndInputValue('');
    }
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2 mb-6">
      <div></div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Layer Number</label>
        <Select 
          value={selectedLayerNumber.toString()} 
          onValueChange={(value) => onLayerChange(parseInt(value))}
        >
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
        <label className="text-sm font-medium">Start</label>
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
        <label className="text-sm font-medium">End</label>
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
