import processForwardPoints from './TenorRates';
import processFDV from './FDV';
import processAnnualizedForwardPoints from './AnnualizedForwardPoints';
import processPremiumDiscountHedgeExposure from './PremiumDiscountHedgeExposure';
import processForwardPointsFavourability from './ForwardPointsFavourability';
import calculateBestTenor from './BestTenor';
import processAnnualizedPLImpact from './AnnualizedPnL';

const enrichRates = (forwardPoints: any[], hedgeExposures: any[] ): any[] => {
  if (!forwardPoints || !hedgeExposures) return [];

  // Step 1: Process forward points to generate single rows per currency pair
  let tenorRates = processForwardPoints(forwardPoints);
  console.log('Tenor rates 1:', tenorRates);

  // Step 2: Work out the forward discount value (FDV) for each currency pair
  tenorRates = processFDV(tenorRates);
  console.log('Tenor rates 2:', tenorRates);

  // Step 3: Calculate the annualized forward points for each currency pair
  tenorRates = processAnnualizedForwardPoints(tenorRates);
  console.log('Tenor rates 3:', tenorRates);

  // Step 4: Calculate the premium/discount and hedge exposure for each currency pair
  tenorRates = processPremiumDiscountHedgeExposure(tenorRates, hedgeExposures);
  console.log('Tenor rates 4:', tenorRates);

  // Step 5: Calculate the forward points favorability for each currency pair
  tenorRates = processForwardPointsFavourability(tenorRates);
  console.log('Tenor rates 5:', tenorRates);

  // Step 6: Calculate the best tenor for each currency pair
  tenorRates = calculateBestTenor(tenorRates);
  console.log('Tenor rates 6:', tenorRates);

  // Step 7: Calculate the annualized P&L impact for each currency pair
  tenorRates = processAnnualizedPLImpact(tenorRates);
  console.log('Tenor rates 7:', tenorRates);

  return tenorRates;
};

export default enrichRates;
