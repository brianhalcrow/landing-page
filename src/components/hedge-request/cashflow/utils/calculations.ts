
export const calculateForecasts = (revenues: Record<number, number>, costs: Record<number, number>) => {
  const forecasts: Record<number, number> = {};
  Object.keys(revenues).forEach((index) => {
    const i = parseInt(index);
    const revenue = revenues[i] || 0;
    const cost = costs[i] || 0;
    forecasts[i] = revenue + cost;
  });
  return forecasts;
};

export const calculateHedgeValues = (
  forecasts: Record<number, number>,
  hedgeRatio: string,
  hedgeLayer: string
) => {
  const ratio = parseFloat(hedgeRatio) || 0;
  const layerPercent = parseFloat(hedgeLayer) || 0;
  const hedgedExposures: Record<number, number> = {};
  const hedgeAmounts: Record<number, number> = {};
  const indicativeCoverage: Record<number, number> = {};

  Object.keys(forecasts).forEach((index) => {
    const i = parseInt(index);
    const forecast = forecasts[i] || 0;
    
    const hedgedExposure = (forecast * ratio) / 100;
    hedgedExposures[i] = hedgedExposure;
    
    const hedgeAmount = (hedgedExposure * layerPercent) / 100;
    hedgeAmounts[i] = hedgeAmount;
    
    indicativeCoverage[i] = forecast !== 0 ? (hedgeAmount / forecast) * 100 : 0;
  });

  return { hedgedExposures, hedgeAmounts, indicativeCoverage };
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number) => {
  return `${Math.round(value)}%`;
};
