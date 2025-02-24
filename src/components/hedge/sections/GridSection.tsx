import { MonthlyLabels } from "../MonthlyLabels";
import { ForecastRow } from "../ForecastRow";
import { HedgeLayerRow } from "../HedgeLayerRow";
import { CoverageRow } from "../CoverageRow";
import { CumulativeRow } from "../CumulativeRow";
import { Separator } from "@/components/ui/separator";
import { format, addMonths } from "date-fns";

interface GridSectionProps {
  formData: {
    monthlyForecasts: string[];
    hedgeLayerAmounts: string[];
    cumulativeHedgeAmounts: string[];
    cumulativeCoveragePercentages: string[];
    coverageValues: string[];
    startDate: string;
    revenueAmounts: string[];
    costAmounts: string[];
  };
  handleMonthlyForecastChange: (index: number, value: string) => void;
  handleHedgeLayerChange: (index: number, value: string) => void;
  handleCoverageChange: (index: number, value: string) => void;
  handleRevenueChange: (index: number, value: string) => void;
  handleCostChange: (index: number, value: string) => void;
  errors: Record<string, boolean>;
}

export const GridSection = ({
  formData,
  handleMonthlyForecastChange,
  handleHedgeLayerChange,
  handleCoverageChange,
  handleRevenueChange,
  handleCostChange,
  errors
}: GridSectionProps) => {
  const getMonthLabels = (startDate: string) => {
    if (!startDate) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      return Array.from({ length: 12 }, (_, i) => {
        const newDate = addMonths(nextMonth, i);
        return format(newDate, 'MM-yy');
      });
    }
    
    const date = new Date(startDate + "-01");
    return Array.from({ length: 12 }, (_, i) => {
      const newDate = addMonths(date, i);
      return format(newDate, 'MM-yy');
    });
  };

  const calculateForecastSum = (index: number) => {
    const revenue = parseFloat(formData.revenueAmounts[index]) || 0;
    const cost = parseFloat(formData.costAmounts[index]) || 0;
    return (revenue + cost).toString();
  };

  return (
    <div className="space-y-3">
      <MonthlyLabels monthLabels={getMonthLabels(formData.startDate)} />
      <CumulativeRow 
        label="Revenues"
        subLabel="Long"
        values={formData.revenueAmounts}
        onChange={(index, value) => {
          handleRevenueChange(index, value);
          handleMonthlyForecastChange(index, calculateForecastSum(index));
        }}
        showSubLabels={true}
        isRevenue={true}
      />
      <CumulativeRow 
        label="Costs"
        subLabel="(Short)"
        values={formData.costAmounts}
        onChange={(index, value) => {
          handleCostChange(index, value);
          handleMonthlyForecastChange(index, calculateForecastSum(index));
        }}
        showSubLabels={true}
        isCost={true}
      />
      <ForecastRow 
        values={formData.monthlyForecasts.map((_, index) => calculateForecastSum(index))}
        onChange={handleMonthlyForecastChange}
      />
      <HedgeLayerRow 
        values={formData.hedgeLayerAmounts}
        onChange={handleHedgeLayerChange}
        forecastValues={formData.monthlyForecasts}
        errors={errors}
      />
      <CoverageRow 
        monthlyForecasts={formData.monthlyForecasts.map((_, index) => calculateForecastSum(index))}
        hedgeLayerAmounts={formData.hedgeLayerAmounts}
        coverageValues={formData.coverageValues}
        onCoverageChange={handleCoverageChange}
      />
      <Separator className="my-4 bg-gray-200" />
      <CumulativeRow 
        label="Cum. Hedge Layer Amounts"
        values={formData.cumulativeHedgeAmounts}
        readOnly
        showSubLabels={true}
      />
      <CumulativeRow 
        label="Cum. Indicative Coverage (%)"
        values={formData.cumulativeCoveragePercentages}
        readOnly
      />
    </div>
  );
};