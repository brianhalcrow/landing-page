import processAnnualizedForwardPoints from '../../src/rates/AnnualizedForwardPoints';

describe('processAnnualizedForwardPoints', () => {
  it('should correctly calculate annualized forward points and round to 5 decimal places', () => {
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
        fdv: 10000,
      },
    ];

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
        fdv: 10000,
        '1M%': -0.00249,
        '3M%': -0.00177,
        '6M%': -0.00140,
        '1Y%': -0.00090,
      },
    ];

    const result = processAnnualizedForwardPoints(tenorRates);

    console.log(result[0]);

    expect(result[0]['1M%']).toBeCloseTo(expected[0]['1M%'], 5);
    expect(result[0]['3M%']).toBeCloseTo(expected[0]['3M%'], 5);
    expect(result[0]['6M%']).toBeCloseTo(expected[0]['6M%'], 5);
    expect(result[0]['1Y%']).toBeCloseTo(expected[0]['1Y%'], 5);

    // Check the remaining structure of the result
    expect(result[0]).toMatchObject({
      currency_pair: 'GBPUSD',
      spot_rate: 1.23058,
      time: '7:29:12',
      rate_date: '2025-01-20',
      fdv: 10000,
    });
  });
});
