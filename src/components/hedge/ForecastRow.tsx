import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForecastRowProps {
  values: string[];
  onChange: (index: number, value: string) => void;
}

export const ForecastRow = ({ values, onChange }: ForecastRowProps) => {
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return Math.round(num).toLocaleString();
  };

  return (
    <div className="grid grid-cols-[200px_repeat(12,minmax(60px,1fr))] gap-1 items-center">
      <div className="pl-2">
        <Label className="text-sm font-medium whitespace-nowrap block">
          Forecast Exposures
        </Label>
        <Label className="text-xs text-gray-500 whitespace-nowrap block">
          Long/(Short)
        </Label>
      </div>
      {values.map((value, index) => (
        <Input
          key={`forecast-${index}`}
          type="text"
          value={formatNumber(value)}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, '');
            onChange(index, rawValue);
          }}
          placeholder="0"
          className="h-8 text-sm px-2"
        />
      ))}
    </div>
  );
};