import { useQuery } from '@tanstack/react-query';

const useHedgeExposures = () => {
  return useQuery({
    queryKey: ['hedge-exposures'],
    queryFn: async () => {
      const response = await fetch('https://api.sensefx.io/pre_trade_hedged_exposure');
      if (!response.ok) throw new Error('Failed to fetch hedge exposures data');
      return response.json();
    }
  });
};

export default useHedgeExposures;
