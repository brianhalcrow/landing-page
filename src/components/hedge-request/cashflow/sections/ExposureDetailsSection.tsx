import { forwardRef, useImperativeHandle, KeyboardEvent, useRef, useState } from "react";
import { addMonths, format } from "date-fns";
import type { ExposureDetailsData } from "../types";
import { HeaderControls } from "../components/HeaderControls";
import { ExposureGrid } from "../components/ExposureGrid";
import { useExposureCalculations } from "../hooks/useExposureCalculations";
import type { HedgeLayerDetails } from "../types/hedge-layer";

interface ExposureDetailsSectionProps {
  value?: ExposureDetailsData;
  onChange?: (value: ExposureDetailsData) => void;
  documentationDate?: string;
  hedgeId?: string;
}

export interface ExposureDetailsSectionRef {
  getCurrentLayerData: () => HedgeLayerDetails | null;
}

const ExposureDetailsSection = forwardRef<ExposureDetailsSectionRef, ExposureDetailsSectionProps>(({ 
  value, 
  onChange, 
  documentationDate,
  hedgeId 
}, ref) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  const {
    revenues,
    setRevenues,
    costs,
    setCosts,
    forecasts,
    hedgeRatio,
    setHedgeRatio,
    hedgeLayer,
    setHedgeLayer,
    hedgeAmounts,
    hedgedExposures,
    indicativeCoverage,
    cumulativeAmounts,
    cumulativeCoverage,
    selectedDate,
    setSelectedDate,
    loading,
    getCurrentLayerData
  } = useExposureCalculations(hedgeId);

  useImperativeHandle(ref, () => ({
    getCurrentLayerData: () => {
      if (!selectedDate || !hedgeId) return null;

      const baseData = getCurrentLayerData();
      if (!baseData) return null;

      return {
        ...baseData,
        hedge_id: hedgeId,
        layer_number: selectedLayer
      };
    }
  }));

  const getMonths = (startDate: Date | undefined) => {
    const baseDate = startDate || new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = addMonths(baseDate, i);
      return format(date, 'MM-yy');
    });
  };

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

  const handleLayerChange = (value: number) => {
    setSelectedLayer(value);
    setRevenues({});
    setCosts({});
    setHedgeRatio('');
    setHedgeLayer('');
  };

  const months = getMonths(selectedDate);

  return (
    <div className="space-y-6">
      <HeaderControls
        hedgeLayer={hedgeLayer}
        hedgeRatio={hedgeRatio}
        selectedDate={selectedDate}
        selectedLayerNumber={selectedLayer}
        onLayerChange={handleLayerChange}
        onHedgeLayerChange={handleHedgeLayerChange}
        onHedgeRatioChange={handleHedgeRatioChange}
        onDateChange={(startDate, endDate) => {
          setSelectedDate(startDate);
          if (onChange) {
            onChange({
              start_month: startDate ? format(startDate, 'yyyy-MM-dd') : '',
              end_month: endDate ? format(endDate, 'yyyy-MM-dd') : ''
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
            hedgedExposures={hedgedExposures}
            hedgeAmounts={hedgeAmounts}
            indicativeCoverage={indicativeCoverage}
            cumulativeAmounts={cumulativeAmounts}
            cumulativeCoverage={cumulativeCoverage}
            onRevenueChange={handleRevenueChange}
            onCostChange={handleCostChange}
            onKeyDown={handleKeyDown}
            inputRefs={inputRefs.current}
          />
        )}
      </div>
    </div>
  );
});

ExposureDetailsSection.displayName = "ExposureDetailsSection";

export default ExposureDetailsSection;
