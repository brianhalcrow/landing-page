import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HedgeLayerRowProps {
  values: string[];
  onChange: (index: number, value: string) => void;
  forecastValues: string[];
  errors?: Record<string, boolean>;
}

export const HedgeLayerRow = ({ values, onChange, forecastValues, errors }: HedgeLayerRowProps) => {
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return Math.round(num).toLocaleString();
  };

  const hasSignError = (forecastValue: string, hedgeValue: string) => {
    const forecast = parseFloat(forecastValue);
    const hedge = parseFloat(hedgeValue);
    if (!isNaN(forecast) && !isNaN(hedge)) {
      return (forecast > 0 && hedge > 0) || (forecast < 0 && hedge < 0);
    }
    return false;
  };

  return (
    <div className="grid grid-cols-[200px_repeat(12,minmax(60px,1fr))] gap-1 items-center">
      <div className="pl-2">
        <Label className="text-sm font-medium whitespace-nowrap block">
          Hedge Layer Amount
        </Label>
        <Label className="text-xs text-gray-500 whitespace-nowrap block">
          Buy/(Sell)
        </Label>
      </div>
      {values.map((value, index) => (
        <Input
          key={`hedge-${index}`}
          type="text"
          value={formatNumber(value)}
          readOnly
          placeholder="0"
          className={cn(
            "h-8 text-sm px-2 bg-gray-50",
            hasSignError(forecastValues[index], value) && "border-red-500"
          )}
        />
      ))}
    </div>
  );
};