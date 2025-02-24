import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, addMonths } from "date-fns";

interface HeaderSectionProps {
  layerNumber: number;
  startDate: string;
  hedgeRatio: string;
  onInputChange: (field: string, value: string | number) => void;
  onHedgeRatioChange: (value: string) => void;
}

export const HeaderSection = ({
  layerNumber,
  startDate,
  hedgeRatio,
  onInputChange,
  onHedgeRatioChange
}: HeaderSectionProps) => {
  const getDefaultStartDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return format(nextMonth, 'yyyy-MM');
  };

  return (
    <div className="flex gap-4 items-end mb-6">
      <div>
        <Label>Layer Number</Label>
        <select
          value={layerNumber}
          onChange={(e) => onInputChange('layerNumber', parseInt(e.target.value))}
          className="w-[120px] p-2 border rounded h-9 text-sm"
          required
        >
          <option value="">Select Layer</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              Layer {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Start Date</Label>
        <Input
          type="month"
          value={startDate || getDefaultStartDate()}
          onChange={(e) => onInputChange('startDate', e.target.value)}
          className="w-[150px] text-sm"
          min={getDefaultStartDate()}
          max={format(addMonths(new Date(), 11), 'yyyy-MM')}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">Hedge Ratio</Label>
        <Input
          type="number"
          value={hedgeRatio}
          onChange={(e) => onHedgeRatioChange(e.target.value)}
          className="w-[100px] text-sm"
          placeholder="Enter %"
        />
      </div>
    </div>
  );
};