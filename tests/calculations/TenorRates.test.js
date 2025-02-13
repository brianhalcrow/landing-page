import processForwardPoints from '../../src/rates/tenorRates';

describe('processForwardPoints', () => {
  it('should correctly process forward points into TenorRow objects', () => {
    const forwardPoints = [
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:29:12',
        tenor: '1M',
        bid: -2.69,
        ask: -2.41,
        rate_date: '2025-01-20',
        all_in_bid: 1.230311,
        all_in_ask: 1.230339,
      },
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:30:01',
        tenor: '3M',
        bid: -5.54,
        ask: -5.32,
        rate_date: '2025-01-20',
        all_in_bid: 1.230026,
        all_in_ask: 1.230048,
      },
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:29:55',
        tenor: '6M',
        bid: -9.93,
        ask: -7.26,
        rate_date: '2025-01-20',
        all_in_bid: 1.229587,
        all_in_ask: 1.229854,
      },
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:29:54',
        tenor: '1Y',
        bid: -13.81,
        ask: -8.31,
        rate_date: '2025-01-20',
        all_in_bid: 1.229199,
        all_in_ask: 1.229749,
      },
    ];

    const result = processForwardPoints(forwardPoints);

    const expected = [
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:29:12',
        rate_date: '2025-01-20',
        '1M': { mid: -2.55, all_in_mid: 1.230325 },
        '3M': { mid: -5.43, all_in_mid: 1.230037 },
        '6M': { mid: -8.595, all_in_mid: 1.229721 },
        '1Y': { mid: -11.06, all_in_mid: 1.229474 },
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return an empty array if input is empty', () => {
    const result = processForwardPoints([]);
    expect(result).toEqual([]);
  });
});
