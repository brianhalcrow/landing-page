
import { useState, useEffect } from 'react';
import { calculateForecasts, calculateHedgeValues } from '../utils/calculations';
import { format, addMonths } from 'date-fns';
import { useHedgeLayer } from './useHedgeLayer';
import { toast } from 'sonner';

export const useExposureCalculations = (hedgeId: string | undefined) => {
  const [revenues, setRevenues] = useState<Record<number, number>>({});
  const [costs, setCosts] = useState<Record<number, number>>({});
  const [forecasts, setForecasts] = useState<Record<number, number>>({});
  const [hedgeRatio, setHedgeRatio] = useState<string>('');
  const [hedgeLayer, setHedgeLayer] = useState<string>('');
  const [hedgeAmounts, setHedgeAmounts] = useState<Record<number, number>>({});
  const [hedgedExposures, setHedgedExposures] = useState<Record<number, number>>({});
  const [indicativeCoverage, setIndicativeCoverage] = useState<Record<number, number>>({});
  const [cumulativeAmounts, setCumulativeAmounts] = useState<Record<number, number>>({});
  const [cumulativeCoverage, setCumulativeCoverage] = useState<Record<number, number>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { layers, loading, loadLayers, saveLayer } = useHedgeLayer(hedgeId || '');

  useEffect(() => {
    if (hedgeId) {
      loadLayers().catch(console.error);
    }
  }, [hedgeId, loadLayers]);

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

    let runningAmount = 0;
    const newCumulativeAmounts: Record<number, number> = {};
    const newCumulativeCoverage: Record<number, number> = {};

    Object.keys(newHedgeAmounts).forEach((index) => {
      const i = parseInt(index);
      runningAmount += newHedgeAmounts[i] || 0;
      newCumulativeAmounts[i] = runningAmount;
      
      const totalForecast = forecasts[i] || 0;
      newCumulativeCoverage[i] = totalForecast !== 0 ? (runningAmount / totalForecast) * 100 : 0;
    });

    setCumulativeAmounts(newCumulativeAmounts);
    setCumulativeCoverage(newCumulativeCoverage);

    if (hedgeId && hedgeRatio && hedgeLayer) {
      const layerData = {
        hedge_id: hedgeId,
        layer_number: 1,
        layer_percentage: parseFloat(hedgeLayer),
        hedge_ratio: parseFloat(hedgeRatio),
        start_month: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        end_month: selectedDate ? format(addMonths(selectedDate, 11), 'yyyy-MM-dd') : '',
        monthly_data: Object.keys(forecasts).map(index => ({
          month_index: parseInt(index),
          revenue: revenues[parseInt(index)] || 0,
          costs: costs[parseInt(index)] || 0,
          net_income: forecasts[parseInt(index)] || 0,
          hedged_exposure: newHedgedExposures[parseInt(index)] || 0,
          hedge_layer_amount: newHedgeAmounts[parseInt(index)] || 0,
          indicative_coverage_percentage: newIndicativeCoverage[parseInt(index)] || 0,
          cumulative_layer_amount: newCumulativeAmounts[parseInt(index)] || 0,
          cumulative_coverage_percentage: newCumulativeCoverage[parseInt(index)] || 0
        }))
      };

      saveLayer(layerData).catch(error => {
        console.error('Error saving layer:', error);
        toast.error('Failed to save hedge layer data');
      });
    }
  }, [forecasts, hedgeRatio, hedgeLayer, hedgeId, selectedDate, saveLayer, revenues, costs]);

  return {
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
    loading
  };
};
