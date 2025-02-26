
import { forwardRef } from "react";
import { format, addMonths, differenceInMonths } from "date-fns";
import { ExposureGrid } from "../components/ExposureGrid";
import { useExposureCalculations } from "../hooks/useExposureCalculations";
import { DocumentationDateInput } from "../components/DocumentationDateInput";

interface ExposureForecastValue {
  start_month: string | null;
  end_month: string | null;
}

interface ExposureForecastSectionProps {
  value: ExposureForecastValue;
  onChange: (value: ExposureForecastValue) => void;
  documentationDate?: string;
  hedgeId?: string;
}

export const ExposureForecastSection = forwardRef<{}, ExposureForecastSectionProps>(
  ({ value, onChange, documentationDate, hedgeId }, ref) => {
    const {
      revenues,
      setRevenues,
      costs,
      setCosts,
      forecasts,
      selectedDate,
      setSelectedDate,
      loading,
      endDate,
      setEndDate
    } = useExposureCalculations(hedgeId);

    const getMonths = (startDate: Date | undefined, endDate: Date | undefined) => {
      if (!startDate || !endDate) return [];
      
      const monthDiff = differenceInMonths(endDate, startDate);
      const numMonths = Math.min(monthDiff + 1, 12);
      
      return Array.from({ length: numMonths }, (_, i) => {
        const date = addMonths(startDate, i);
        return format(date, 'MM-yy');
      });
    };

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

    const months = getMonths(selectedDate, endDate);

    return (
      <div className="space-y-6">
        <div>
          <DocumentationDateInput
            startDate={selectedDate}
            endDate={endDate}
            onChange={(startDate, endDate) => {
              setSelectedDate(startDate);
              setEndDate(endDate);
              if (onChange) {
                onChange({
                  start_month: startDate ? format(startDate, 'yyyy-MM-dd') : null,
                  end_month: endDate ? format(endDate, 'yyyy-MM-dd') : null
                });
              }
            }}
          />
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-gray-500">Loading forecast data...</span>
            </div>
          ) : (
            <ExposureGrid
              months={months}
              revenues={revenues}
              costs={costs}
              forecasts={forecasts}
              hedgedExposures={{}}
              hedgeAmounts={{}}
              indicativeCoverage={{}}
              cumulativeAmounts={{}}
              cumulativeCoverage={{}}
              onRevenueChange={handleRevenueChange}
              onCostChange={handleCostChange}
              onKeyDown={() => {}}
              inputRefs={[]}
            />
          )}
        </div>
      </div>
    );
  }
);

ExposureForecastSection.displayName = 'ExposureForecastSection';

export default ExposureForecastSection;
