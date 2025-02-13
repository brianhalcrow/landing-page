import { useQuery } from '@tanstack/react-query';

const API_KEY = '205c3dcff9feb9ea22b221c5a828d6acb71a7319';
const CURRENCY_PAIRS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "EURGBP", "USDCAD",
  "EURJPY", "EURCHF", "GBPJPY", "GBPCHF", "EURAUD", "EURCAD", "EURNOK",
  "USDDKK", "EURDKK", "USDNOK", "GBPNOK", "EURMXN", "GBPDKK", "USDKWD",
  "USDSAR", "EURRON", "GBPRON", "GBPSAR", "USDCNY", "USDCOP", "USDOMR", "USDRON"
];

const fetchSpotRates = async () => {
  const url = `https://api.tiingo.com/tiingo/fx/top?tickers=${CURRENCY_PAIRS.join(',')}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${API_KEY}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${errorText}`);
  }
  const data = await response.json();
  return data;
};

const useSpotRatesData = () => {
  return useQuery({
    queryKey: ['spot-rates'],
    queryFn: fetchSpotRates,
  });
};

export default useSpotRatesData;
