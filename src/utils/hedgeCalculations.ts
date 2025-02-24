
export const calculateHedgeLayerAmount = (forecast: string, hedgeRatio: string): string => {
  const forecastNum = parseFloat(forecast);
  const ratioNum = parseFloat(hedgeRatio);
  
  if (isNaN(forecastNum) || isNaN(ratioNum)) {
    return '0';
  }

  // Calculate hedge amount based on forecast and ratio percentage
  const hedgeAmount = (forecastNum * (ratioNum / 100));
  
  // Return opposite sign of forecast (if forecast is positive, hedge should be negative and vice versa)
  return (-hedgeAmount).toString();
};

export const calculateCoverage = (forecast: string, hedgeAmount: string): string => {
  const forecastNum = parseFloat(forecast);
  const hedgeNum = parseFloat(hedgeAmount);
  
  if (isNaN(forecastNum) || isNaN(hedgeNum) || forecastNum === 0) {
    return '0';
  }

  // Calculate coverage percentage
  return Math.round((Math.abs(hedgeNum) / Math.abs(forecastNum)) * 100).toString();
};
