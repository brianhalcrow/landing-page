import { useQuery } from '@tanstack/react-query';

const useForwardPointsData = (baseCurrency, termCurrencies, tenors) => {
  return useQuery({
    queryKey: ['forward-points', baseCurrency, termCurrencies, tenors],
    queryFn: async () => {
      const response = await fetch('https://api.sensefx.io/pre_trade_rates');
      console.log('API response:', response);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }
      const data = await response.json();

      // Filter data based on the selected base currency, term currencies, and tenors
      const filteredData = data.filter(item => {
        const pair = item.currency_pair;

        // Check if the pair matches base + term or term + base
        const isMatchingPair = pair === `${baseCurrency}${termCurrencies.find(term => pair === `${baseCurrency}${term}` || pair === `${term}${baseCurrency}`)}`;

        return isMatchingPair && tenors.includes(item.tenor);
      });

      console.log('Filtered data:', filteredData);

      return filteredData;

    }
  });
};

export default useForwardPointsData;
