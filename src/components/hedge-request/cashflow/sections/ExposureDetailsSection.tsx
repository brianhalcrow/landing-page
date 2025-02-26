
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { format } from "date-fns";
import { ExposureGrid } from "../components/ExposureGrid";
import { useExposureCalculations } from "../hooks/useExposureCalculations";
import { LayerControls } from "../components/LayerControls";
import { useGridInputHandler } from "../components/GridInputHandler";
import type { HedgeLayerDetails } from "../types/hedge-layer";

interface ExposureDetailsData {
  start_month: string;
  end_month: string;
}

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
  const [endDate, setEndDate] = useState<Date>();

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

  const { handleKeyDown } = useGridInputHandler({ inputRefs });

  useImperativeHandle(ref, () => ({
    getCurrentLayerData: () => {
      if (!selectedDate || !hedgeId) return null;

      const baseData = getCurrentLayerData();
      if (!baseData) return null;

      return {
        ...baseData,
        hedge_id: hedgeId,
        layer_number: 1  // Default to first layer
      };
    }
  }));

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

  const handleLayerChange = (value: number) => {
    setRevenues({});
    setCosts({});
    setHedgeRatio('');
    setHedgeLayer('');
  };

  return (
    <div className="space-y-6">
      <LayerControls
        hedgeLayer={hedgeLayer}
        hedgeRatio={hedgeRatio}
        selectedDate={selectedDate}
        onLayerChange={handleLayerChange}
        onHedgeLayerChange={setHedgeLayer}
        onHedgeRatioChange={setHedgeRatio}
        onDateChange={(startDate, endDate) => {
          setSelectedDate(startDate);
          setEndDate(endDate);
          if (onChange && startDate && endDate) {
            onChange({
              start_month: format(startDate, 'yyyy-MM-dd'),
              end_month: format(endDate, 'yyyy-MM-dd')
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
            months={Object.keys(revenues)}
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
