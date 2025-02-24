
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HeaderSection } from "./sections/HeaderSection";
import { GridSection } from "./sections/GridSection";
import { calculateHedgeLayerAmount } from "@/utils/hedgeCalculations";

interface HedgedItemProps {
  formData: {
    monthlyForecasts: string[];
    hedgeLayerAmounts: string[];
    cumulativeHedgeAmounts: string[];
    cumulativeCoveragePercentages: string[];
    coverageValues: string[];
    layerNumber: number;
    hedgeRatio: string;
    startDate: string;
    revenueAmounts: string[];
    costAmounts: string[];
  };
  monthLabels: string[];
  handleMonthlyForecastChange: (index: number, value: string) => void;
  handleHedgeLayerChange: (index: number, value: string) => void;
  handleCoverageChange: (index: number, value: string) => void;
  handleInputChange: (field: string, value: string | number) => void;
  handleRevenueChange: (index: number, value: string) => void;
  handleCostChange: (index: number, value: string) => void;
  errors: Record<string, boolean>;
}

export const HedgedItem = ({
  formData,
  handleMonthlyForecastChange,
  handleHedgeLayerChange,
  handleCoverageChange,
  handleInputChange,
  handleRevenueChange,
  handleCostChange,
  errors
}: HedgedItemProps) => {
  const calculateForecastSum = (index: number) => {
    const revenue = parseFloat(formData.revenueAmounts[index]) || 0;
    const cost = parseFloat(formData.costAmounts[index]) || 0;
    return (revenue + cost).toString();
  };

  const handleHedgeRatioChange = (value: string) => {
    console.log('Hedge ratio changed:', value);
    handleInputChange('hedgeRatio', value);
    
    formData.monthlyForecasts.forEach((_, index) => {
      const forecastSum = calculateForecastSum(index);
      console.log('Updating hedge amount for month', index, 'forecast sum:', forecastSum);
      const hedgeAmount = calculateHedgeLayerAmount(forecastSum, value);
      console.log('New hedge amount for month', index, ':', hedgeAmount);
      handleHedgeLayerChange(index, hedgeAmount);
    });
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Exposure Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <HeaderSection
            layerNumber={formData.layerNumber}
            startDate={formData.startDate}
            hedgeRatio={formData.hedgeRatio}
            onInputChange={handleInputChange}
            onHedgeRatioChange={handleHedgeRatioChange}
          />
          <GridSection
            formData={formData}
            handleMonthlyForecastChange={handleMonthlyForecastChange}
            handleHedgeLayerChange={handleHedgeLayerChange}
            handleCoverageChange={handleCoverageChange}
            handleRevenueChange={handleRevenueChange}
            handleCostChange={handleCostChange}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};
