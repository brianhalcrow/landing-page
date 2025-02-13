const calculateBestTenorForRate = (tenorRates: any[]): any[] => {
  return tenorRates.map((rate) => {
    const tenors = ['1M%', '3M%', '6M%', '1Y%'];
    let bestTenor: string | null = null;

    if (rate.forwardPointsFavourability === 'Favourable') {
      // Find the max percentage
      bestTenor = tenors.reduce((best, tenor) => {
        return rate[tenor] > rate[best] ? tenor : best;
      }, tenors[0]);
    } else {
      // Find the min percentage
      bestTenor = tenors.reduce((best, tenor) => {
        return rate[tenor] < rate[best] ? tenor : best;
      }, tenors[0]);
    }

    const bestTenorValue = bestTenor !== null ? rate[bestTenor] : null;

    return { ...rate, bestTenor: bestTenorValue };
  });
};

export default calculateBestTenorForRate;
