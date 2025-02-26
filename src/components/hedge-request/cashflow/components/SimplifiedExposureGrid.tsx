
import { KeyboardEvent } from 'react';
import { GridInputRow } from './GridInputRow';
import { formatNumber } from '../utils/calculations';

interface SimplifiedExposureGridProps {
  months: string[];
  revenues: Record<number, number>;
  costs: Record<number, number>;
  forecasts: Record<number, number>;
  onRevenueChange: (index: number, value: string) => void;
  onCostChange: (index: number, value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => void;
  inputRefs: (HTMLInputElement | null)[];
}

export const SimplifiedExposureGrid = ({
  months,
  revenues,
  costs,
  forecasts,
  onRevenueChange,
  onCostChange,
  onKeyDown,
  inputRefs,
}: SimplifiedExposureGridProps) => {
  return (
    <>
      <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2">
        <div className="h-6"></div>
        {Array(12).fill(null).map((_, index) => (
          <div key={index} className="text-sm font-medium text-center">
            {months[index]}
          </div>
        ))}
      </div>

      <GridInputRow
        label="Revenues"
        sublabel="Long"
        values={revenues}
        onChange={onRevenueChange}
        onKeyDown={onKeyDown}
        rowIndex={0}
        monthCount={12}
        inputRefs={inputRefs}
        refStartIndex={0}
        formatValue={formatNumber}
      />

      <GridInputRow
        label="Costs"
        sublabel="(Short)"
        values={costs}
        onChange={onCostChange}
        onKeyDown={onKeyDown}
        rowIndex={1}
        monthCount={12}
        inputRefs={inputRefs}
        refStartIndex={12}
        formatValue={formatNumber}
        onFocus={(e) => {
          if (!e.target.value) {
            e.target.value = '-';
          }
        }}
      />

      <GridInputRow
        label="Forecast Exposures"
        sublabel="Long/(Short)"
        values={forecasts}
        onChange={() => {}}
        onKeyDown={() => {}}
        rowIndex={2}
        monthCount={12}
        inputRefs={[]}
        refStartIndex={24}
        formatValue={formatNumber}
        readOnly
      />
    </>
  );
};
