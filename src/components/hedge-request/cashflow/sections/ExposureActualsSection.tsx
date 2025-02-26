
import { forwardRef, useState, useRef } from "react";
import { format } from "date-fns";
import { HeaderControls } from "../components/HeaderControls";
import { GridInputRow } from "../components/GridInputRow";
import { formatNumber } from "../utils/calculations";

interface ExposureActualsSectionProps {
  documentationDate?: string;
  hedgeId?: string;
}

export const ExposureActualsSection = forwardRef<{}, ExposureActualsSectionProps>(
  ({ documentationDate, hedgeId }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [revenues, setRevenues] = useState<Record<number, number>>({});
    const [costs, setCosts] = useState<Record<number, number>>({});
    const [actuals, setActuals] = useState<Record<number, number>>({});
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
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

    return (
      <div className="space-y-6">
        <HeaderControls
          selectedDate={selectedDate}
          onDateChange={(startDate, endDate) => {
            setSelectedDate(startDate);
          }}
        />

        <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2">
          <div className="h-6"></div>
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="text-sm font-medium text-center">
              {selectedDate ? format(new Date(selectedDate), 'MM-yy') : '--'}
            </div>
          ))}
        </div>
        
        <GridInputRow
          label="Revenues"
          sublabel="Long"
          values={revenues}
          onChange={handleRevenueChange}
          onKeyDown={handleKeyDown}
          rowIndex={0}
          monthCount={12}
          inputRefs={inputRefs.current}
          refStartIndex={0}
          formatValue={formatNumber}
        />

        <GridInputRow
          label="Costs"
          sublabel="(Short)"
          values={costs}
          onChange={handleCostChange}
          onKeyDown={handleKeyDown}
          rowIndex={1}
          monthCount={12}
          inputRefs={inputRefs.current}
          refStartIndex={12}
          formatValue={formatNumber}
          onFocus={(e) => {
            if (!e.target.value) {
              e.target.value = '-';
            }
          }}
        />

        <GridInputRow
          label="Actual Exposures"
          sublabel="Long/(Short)"
          values={actuals}
          onChange={() => {}}
          onKeyDown={() => {}}
          rowIndex={2}
          monthCount={12}
          inputRefs={[]}
          refStartIndex={24}
          formatValue={formatNumber}
          readOnly
        />
      </div>
    );
  }
);

ExposureActualsSection.displayName = 'ExposureActualsSection';

export default ExposureActualsSection;
