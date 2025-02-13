const processPremiumDiscountHedgeExposure = (tenorRates: any[], hedgeExposures: any[]): any[] => {
  return tenorRates.map((rate) => {
    const [baseCurrency, termsCurrency] = [rate.currency_pair.substring(0, 3), rate.currency_pair.substring(3, 6)];
    
    // Find exposures for both base and terms currencies
    const baseExposure = hedgeExposures.find((exposure: any) => exposure.currency === baseCurrency);
    const termsExposure = hedgeExposures.find((exposure: any) => exposure.currency === termsCurrency);

    // Extract amounts for base and terms currencies
    const baseAmount1 = baseExposure?.amount1 || 0;
    const baseAmount2 = baseExposure?.amount2 || 0;
    const baseAmount3 = baseExposure?.amount3 || 0;

    const termsAmount1 = termsExposure?.amount1 || 0;
    const termsAmount2 = termsExposure?.amount2 || 0;
    const termsAmount3 = termsExposure?.amount3 || 0;

    // Determine hedged exposure and premium/discount
    const hedgedExposure = baseAmount1 > 0 ? 'Positive' : 'Negative';
    const premiumDiscount = rate['1M%'] > 0 ? 'Premium' : 'Discount';

    return { 
      ...rate, 
      premiumDiscount, 
      hedgedExposure, 
      baseAmount1, 
      baseAmount2, 
      baseAmount3, 
      termsAmount1, 
      termsAmount2, 
      termsAmount3 
    };
  });
};

export default processPremiumDiscountHedgeExposure;
