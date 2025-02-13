const processAnnualizedForwardPoints = (tenorRates: any[]): any[] => {
  return tenorRates.map((rate) => {
    const spotRate = rate.spot_rate || 0;
    const calculateAnnualized = (mid: number | null, multiplier: number) =>
      mid !== null
        ? parseFloat(((mid / rate.fdv / spotRate) * multiplier).toFixed(5))
        : null;

    return {
      ...rate,
      '1M%': calculateAnnualized(rate['1M']?.mid, 12),
      '3M%': calculateAnnualized(rate['3M']?.mid, 4),
      '6M%': calculateAnnualized(rate['6M']?.mid, 2),
      '1Y%': calculateAnnualized(rate['1Y']?.mid, 1),
    };
  });
};

export default processAnnualizedForwardPoints;
