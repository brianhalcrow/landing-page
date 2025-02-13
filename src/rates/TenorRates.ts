export type TenorData = {
    mid: number;
    all_in_mid: number;
  };
  
  export type TenorRow = {
    currency_pair: string;
    spot_rate: number;
    time: string;
    rate_date: string;
    '1M': TenorData | null;
    '3M': TenorData | null;
    '6M': TenorData | null;
    '1Y': TenorData | null;
  };
  
  const processForwardPoints = (forwardPoints: any[]): TenorRow[] => {
    if (!forwardPoints || forwardPoints.length === 0) return [];
  
    const groupedData: Record<string, TenorRow> = {};
  
    forwardPoints.forEach((point) => {
      const { currency_pair, spot_rate, time, rate_date, tenor, bid, ask, all_in_bid, all_in_ask } = point;
  
      if (!groupedData[currency_pair]) {
        groupedData[currency_pair] = {
          currency_pair,
          spot_rate,
          time,
          rate_date,
          '1M': null,
          '3M': null,
          '6M': null,
          '1Y': null,
        };
      }

      const round = (value) => Math.round(value * 1e6) / 1e6;
  
      groupedData[currency_pair][tenor] = {
        mid: round((bid + ask) / 2),
        all_in_mid: round((all_in_bid + all_in_ask) / 2),
      };
    });
  
    return Object.values(groupedData);
  };
  
  export default processForwardPoints;
  