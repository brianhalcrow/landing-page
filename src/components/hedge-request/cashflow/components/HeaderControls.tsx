import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
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
  const [inputValue, setInputValue] = useState('');
  const formatMonthInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length >= 4) {
      const month = digitsOnly.substring(0, 2);
      const year = digitsOnly.substring(2, 4);
      return `${month}-${year}`;
    }
    return digitsOnly;
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formattedValue = formatMonthInput(raw);
    setInputValue(formattedValue);
    if (formattedValue.length === 5) {
      const [month, year] = formattedValue.split('-');
      const date = new Date(2000 + parseInt(year), parseInt(month) - 1);
      onDateChange(date);
    } else {
      onDateChange(undefined);
    }
  };
  return <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2 mb-6">
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
          <Input type="number" value={hedgeLayer} onChange={e => onHedgeLayerChange(e.target.value)} placeholder="Enter %" min="0" max="100" step="1" className="pr-0" />
          
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Month</label>
        <Input type="text" placeholder="MMYY" maxLength={5} onChange={handleMonthChange} value={inputValue} className="text-left" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge Ratio %</label>
        <div className="relative">
          <Input type="number" value={hedgeRatio} onChange={e => onHedgeRatioChange(e.target.value)} placeholder="Enter %" min="0" max="100" step="1" className="pr-0" />
          
        </div>
      </div>
    </div>;
};