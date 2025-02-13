const processAnnualizedPnL = (tenorRates: any[]): any[] => {
  return tenorRates.map((rate) => {
    const baseAmount1 = rate.baseAmount1 || 0; // Default to 0 if baseAmount1 is missing

    // Calculate oneMonth using 1M% and baseAmount1
    const oneMonth = rate['1M%'] ? parseFloat((rate['1M%'] * baseAmount1 * 1000).toFixed(2)) : null;

    // Calculate best using bestTenor and baseAmount1
    const bestTenorRate = rate.bestTenor;
    const best = bestTenorRate ? parseFloat((bestTenorRate * baseAmount1 * 1000).toFixed(2)) : null;

    // Calculate benefit as the absolute difference between oneMonth and best
    const benefit = oneMonth !== null && best !== null ? parseFloat(Math.abs(oneMonth - best).toFixed(2)) : null;

    return { ...rate, oneMonth, best, benefit };
  });
};

export default processAnnualizedPnL;
