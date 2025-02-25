
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { addMonths, format } from "date-fns";
import { HeaderControls } from "../components/HeaderControls";
import { GridInputRow } from "../components/GridInputRow";
import { calculateForecasts, calculateHedgeValues, formatNumber, formatPercentage } from "../utils/calculations";

const ExposureDetailsSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [revenues, setRevenues] = useState<Record<number, number>>({});
  const [costs, setCosts] = useState<Record<number, number>>({});
  const [forecasts, setForecasts] = useState<Record<number, number>>({});
  const [hedgeRatio, setHedgeRatio] = useState<string>('');
  const [hedgeLayer, setHedgeLayer] = useState<string>('');
  const [hedgeAmounts, setHedgeAmounts] = useState<Record<number, number>>({});
  const [hedgedExposures, setHedgedExposures] = useState<Record<number, number>>({});
  const [indicativeCoverage, setIndicativeCoverage] = useState<Record<number, number>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getMonths = (startDate: Date | undefined) => {
    const baseDate = startDate || new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = addMonths(baseDate, i);
      return format(date, 'MM-yy');
    });
  };

  const months = getMonths(selectedDate);

  useEffect(() => {
    const newForecasts = calculateForecasts(revenues, costs);
    setForecasts(newForecasts);
  }, [revenues, costs]);

  useEffect(() => {
    const { hedgedExposures: newHedgedExposures, hedgeAmounts: newHedgeAmounts, indicativeCoverage: newIndicativeCoverage } = 
      calculateHedgeValues(forecasts, hedgeRatio, hedgeLayer);

    setHedgedExposures(newHedgedExposures);
    setHedgeAmounts(newHedgeAmounts);
    setIndicativeCoverage(newIndicativeCoverage);
  }, [forecasts, hedgeRatio, hedgeLayer]);

  const handleHedgeRatioChange = (value: string) => {
    if (value === '') {
      setHedgeRatio('');
      return;
    }
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setHedgeRatio(String(Math.min(100, numericValue)));
    }
  };

  const handleHedgeLayerChange = (value: string) => {
    if (value === '') {
      setHedgeLayer('');
      return;
    }
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setHedgeLayer(String(Math.min(100, numericValue)));
    }
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

  return (
    <div className="space-y-6">
      <HeaderControls
        hedgeLayer={hedgeLayer}
        hedgeRatio={hedgeRatio}
        selectedDate={selectedDate}
        onHedgeLayerChange={handleHedgeLayerChange}
        onHedgeRatioChange={handleHedgeRatioChange}
        onDateChange={setSelectedDate}
      />

      <div className="space-y-2">
        <div className="grid grid-cols-[200px_repeat(12,105px)] gap-2">
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

        <GridInputRow
          label="Hedged Exposure"
          sublabel="Long/(Short)"
          values={hedgedExposures}
          onChange={() => {}}
          onKeyDown={() => {}}
          rowIndex={3}
          monthCount={12}
          inputRefs={[]}
          refStartIndex={36}
          formatValue={formatNumber}
          readOnly
        />

        <GridInputRow
          label="Hedge Layer Amount"
          sublabel="Buy/(Sell)"
          values={hedgeAmounts}
          onChange={() => {}}
          onKeyDown={() => {}}
          rowIndex={4}
          monthCount={12}
          inputRefs={[]}
          refStartIndex={48}
          formatValue={formatNumber}
          readOnly
        />

        <GridInputRow
          label="Indicative Coverage"
          sublabel=""
          values={indicativeCoverage}
          onChange={() => {}}
          onKeyDown={() => {}}
          rowIndex={5}
          monthCount={12}
          inputRefs={[]}
          refStartIndex={60}
          formatValue={formatPercentage}
          readOnly
        />
      </div>
    </div>
  );
};

export default ExposureDetailsSection;
