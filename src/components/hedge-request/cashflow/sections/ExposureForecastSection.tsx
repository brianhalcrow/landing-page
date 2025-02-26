
import { forwardRef, useImperativeHandle, KeyboardEvent, useRef, useState } from "react";
import { format, differenceInMonths } from "date-fns";
import { HeaderControls } from "../components/HeaderControls";
import { ExposureGrid } from "../components/ExposureGrid";
import { useExposureCalculations } from "../hooks/useExposureCalculations";

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
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [endDate, setEndDate] = useState<Date>();

    const {
      revenues,
      setRevenues,
      costs,
      setCosts,
      forecasts,
      selectedDate,
      setSelectedDate,
      loading,
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

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
      const currentInput = event.currentTarget;
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          const upInput = inputRefs.current[colIndex];
          if (upInput) upInput.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          const downInput = inputRefs.current[colIndex + 12];
          if (downInput) downInput.focus();
          break;
        case 'ArrowLeft':
          if (currentInput.selectionStart === 0) {
            event.preventDefault();
            const prevInput = inputRefs.current[rowIndex * 12 + colIndex - 1];
            if (prevInput) prevInput.focus();
          }
          break;
        case 'ArrowRight':
          if (currentInput.selectionStart === currentInput.value.length) {
            event.preventDefault();
            const nextInput = inputRefs.current[rowIndex * 12 + colIndex + 1];
            if (nextInput) nextInput.focus();
          }
          break;
      }
    };

    const months = getMonths(selectedDate, endDate);

    return (
      <div className="space-y-6">
        <HeaderControls
          selectedDate={selectedDate}
          onDateChange={(startDate, endDate) => {
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

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-gray-500">Loading hedge layer data...</span>
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
              onKeyDown={handleKeyDown}
              inputRefs={inputRefs.current}
            />
          )}
        </div>
      </div>
    );
  }
);

ExposureForecastSection.displayName = 'ExposureForecastSection';

export default ExposureForecastSection;
