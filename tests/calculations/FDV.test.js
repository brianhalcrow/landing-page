import processFDV from '../../src/rates/FDV';

describe('processFDV', () => {
  it('should process tenorRates and add the correct fdv value', () => {
    const tenorRates = [
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

    const expectedOutput = [
      {
        currency_pair: 'GBPUSD',
        spot_rate: 1.23058,
        time: '7:29:12',
        rate_date: '2025-01-20',
        '1M': { mid: -2.55, all_in_mid: 1.230325 },
        '3M': { mid: -5.43, all_in_mid: 1.230037 },
        '6M': { mid: -8.595, all_in_mid: 1.229721 },
        '1Y': { mid: -11.06, all_in_mid: 1.229474 },
        fdv: 10000, // Expected fdv for GBPUSD
      },
    ];

    const result = processFDV(tenorRates);

    expect(result).toEqual(expectedOutput);
  });
});