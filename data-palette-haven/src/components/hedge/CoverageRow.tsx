import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCoverage } from "@/utils/hedgeCalculations";

interface CoverageRowProps {
  monthlyForecasts: string[];
  hedgeLayerAmounts: string[];
  coverageValues: string[];
  onCoverageChange: (index: number, value: string) => void;
}

export const CoverageRow = ({ 
  monthlyForecasts, 
  hedgeLayerAmounts,
  coverageValues,
  onCoverageChange
}: CoverageRowProps) => {
  const formatCoverage = (forecast: string, hedgeAmount: string) => {
    const coverage = calculateCoverage(forecast, hedgeAmount);
    return coverage === '0' ? '0%' : `${coverage}%`;
  };

  return (
    <div className="grid grid-cols-[200px_repeat(12,minmax(60px,1fr))] gap-1 items-center">
      <Label className="text-sm font-medium whitespace-nowrap pl-2">
        Indicative Coverage
      </Label>
      {monthlyForecasts.map((forecast, index) => (
        <Input
          key={`coverage-${index}`}
          type="text"
          value={formatCoverage(forecast, hedgeLayerAmounts[index])}
          readOnly
          className="h-8 text-sm px-2 bg-gray-50"
        />
      ))}
    </div>
  );
};