import { useState, useEffect } from "react";
import { format, addMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MonthlyData {
  month_index: number;
  revenue: number;
  costs: number;
  net_income: number;
  hedged_exposure: number;
  hedge_layer_amount: number;
  indicative_coverage_percentage: number;
  cumulative_layer_amount: number;
  cumulative_coverage_percentage: number;
}

export const useExposureCalculations = (hedgeId?: string) => {
  const [revenues, setRevenues] = useState<Record<number, number>>({});
  const [costs, setCosts] = useState<Record<number, number>>({});
  const [hedgeRatio, setHedgeRatio] = useState<string>('');
  const [hedgeLayer, setHedgeLayer] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState<Date>();

  const calculateNetIncome = (index: number) => {
    const revenue = revenues[index] || 0;
    const cost = costs[index] || 0;
    return revenue + cost;
  };

  const calculateHedgedExposure = (index: number, hedgeRatio: number) => {
    const netIncome = calculateNetIncome(index);
    return netIncome * hedgeRatio;
  };

  const calculateHedgeAmount = (index: number, hedgeRatio: number, hedgeLayer: number) => {
    const hedgedExposure = calculateHedgedExposure(index, hedgeRatio);
    return hedgedExposure * hedgeLayer;
  };

  const calculateIndicativeCoverage = (index: number, hedgeRatio: number, hedgeLayer: number) => {
    const netIncome = calculateNetIncome(index);
    if (netIncome === 0) return 0;
    const hedgeAmount = calculateHedgeAmount(index, hedgeRatio, hedgeLayer);
    return (hedgeAmount / netIncome) * 100;
  };

  const calculateCumulativeAmount = (index: number, hedgeRatio: number, hedgeLayer: number) => {
    let cumulativeAmount = 0;
    for (let i = 0; i <= index; i++) {
      cumulativeAmount += calculateHedgeAmount(i, hedgeRatio, hedgeLayer);
    }
    return cumulativeAmount;
  };

  const calculateCumulativeCoverage = (index: number, hedgeRatio: number, hedgeLayer: number) => {
    let cumulativeExposure = 0;
    let cumulativeHedge = 0;

    for (let i = 0; i <= index; i++) {
      cumulativeExposure += calculateNetIncome(i);
      cumulativeHedge += calculateHedgeAmount(i, hedgeRatio, hedgeLayer);
    }

    if (cumulativeExposure === 0) return 0;
    return (cumulativeHedge / cumulativeExposure) * 100;
  };

  const getCurrentLayerData = () => {
    if (!selectedDate || !endDate) return null;
    
    const monthlyData: MonthlyData[] = [];
    const hedgeRatioNum = parseFloat(hedgeRatio) / 100;
    const hedgeLayerNum = parseFloat(hedgeLayer) / 100;

    for (let i = 0; ; i++) {
      const currentDate = addMonths(selectedDate, i);
      
      // Stop if we've gone past the end date
      if (currentDate > endDate) break;
      
      const monthData: MonthlyData = {
        month_index: i,
        revenue: revenues[i] || 0,
        costs: costs[i] || 0,
        net_income: calculateNetIncome(i),
        hedged_exposure: calculateHedgedExposure(i, hedgeRatioNum),
        hedge_layer_amount: calculateHedgeAmount(i, hedgeRatioNum, hedgeLayerNum),
        indicative_coverage_percentage: calculateIndicativeCoverage(i, hedgeRatioNum, hedgeLayerNum),
        cumulative_layer_amount: calculateCumulativeAmount(i, hedgeRatioNum, hedgeLayerNum),
        cumulative_coverage_percentage: calculateCumulativeCoverage(i, hedgeRatioNum, hedgeLayerNum)
      };
      monthlyData.push(monthData);
    }

    return {
      hedge_ratio: parseFloat(hedgeRatio),
      layer_percentage: parseFloat(hedgeLayer),
      start_month: format(selectedDate, 'yyyy-MM-dd'),
      end_month: format(endDate, 'yyyy-MM-dd'),
      monthly_data: monthlyData
    };
  };

  useEffect(() => {
    if (!hedgeId) return;

    const fetchHedgeLayerDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('hedge_layer_details')
          .select('*')
          .eq('hedge_id', hedgeId);

        if (error) {
          console.error("Error fetching hedge layer details:", error);
          toast.error("Failed to load hedge layer details.");
          return;
        }

        if (data && data.length > 0) {
          // Assuming the first entry contains the relevant hedge ratio and layer
          const firstLayer = data[0];
          setHedgeRatio(firstLayer.hedge_ratio?.toString() || '');
          setHedgeLayer(firstLayer.layer_percentage?.toString() || '');

          // Aggregate revenues and costs from all entries
          const aggregatedRevenues: Record<number, number> = {};
          const aggregatedCosts: Record<number, number> = {};

          data.forEach(item => {
            const monthIndex = item.month_index;
            aggregatedRevenues[monthIndex] = (aggregatedRevenues[monthIndex] || 0) + (item.revenue || 0);
            aggregatedCosts[monthIndex] = (aggregatedCosts[monthIndex] || 0) + (item.costs || 0);
          });

          setRevenues(aggregatedRevenues);
          setCosts(aggregatedCosts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHedgeLayerDetails();
  }, [hedgeId]);

  return {
    revenues,
    setRevenues,
    costs,
    setCosts,
    forecasts: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [i, calculateNetIncome(i)])
    ),
    hedgeRatio,
    setHedgeRatio,
    hedgeLayer,
    setHedgeLayer,
    hedgeAmounts: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [
        i,
        calculateHedgeAmount(i, parseFloat(hedgeRatio) / 100, parseFloat(hedgeLayer) / 100)
      ])
    ),
    hedgedExposures: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [
        i,
        calculateHedgedExposure(i, parseFloat(hedgeRatio) / 100)
      ])
    ),
    indicativeCoverage: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [
        i,
        calculateIndicativeCoverage(i, parseFloat(hedgeRatio) / 100, parseFloat(hedgeLayer) / 100)
      ])
    ),
    cumulativeAmounts: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [
        i,
        calculateCumulativeAmount(i, parseFloat(hedgeRatio) / 100, parseFloat(hedgeLayer) / 100)
      ])
    ),
    cumulativeCoverage: Object.fromEntries(
      Object.keys(revenues).map(Number).map(i => [
        i,
        calculateCumulativeCoverage(i, parseFloat(hedgeRatio) / 100, parseFloat(hedgeLayer) / 100)
      ])
    ),
    selectedDate,
    setSelectedDate,
    endDate,
    setEndDate,
    loading,
    getCurrentLayerData
  };
};
