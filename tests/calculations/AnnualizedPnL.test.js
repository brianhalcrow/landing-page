import processAnnualizedPnL  from '../../src/rates/AnnualizedPnL';

describe('processAnnualizedPnL', () => {
  it('should process tenor rates correctly and calculate oneMonth, best, and benefit', () => {
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
        '1M%': -0.00249,
        '3M%': -0.00177,
        '6M%': -0.0014,
        '1Y%': -0.0009,
        premiumDiscount: 'Discount',
        hedgedExposure: 'Negative',
        baseAmount1: -257.6,
        baseAmount2: -233.5,
        baseAmount3: -262.9,
        termsAmount1: 0,
        termsAmount2: 0,
        termsAmount3: 0,
        forwardPointsFavourability: 'Favourable',
        bestTenor: -0.0009,
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
        '6M%': -0.0014,
        '1Y%': -0.0009,
        premiumDiscount: 'Discount',
        hedgedExposure: 'Negative',
        baseAmount1: -257.6,
        baseAmount2: -233.5,
        baseAmount3: -262.9,
        termsAmount1: 0,
        termsAmount2: 0,
        termsAmount3: 0,
        forwardPointsFavourability: 'Favourable',
        bestTenor: -0.0009,
        oneMonth: 641.42,
        best: 231.84,
        benefit: 409.58
      },
    ];

    const result = processAnnualizedPnL(tenorRates);

    expect(result).toEqual(expected);
  });
});
