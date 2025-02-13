import enrichRates from '../../src/rates/enrichRates';

// Input data
const hedgeExposures = [
  { currency: 'CAD', amount1: 642.7, amount2: 623.9, amount3: 609.1 },
  { currency: 'CHF', amount1: 0, amount2: 0, amount3: 0 },
  { currency: 'DKK', amount1: -6.8, amount2: -8.1, amount3: -12.2 },
  { currency: 'EUR', amount1: 136.8, amount2: 118.4, amount3: 149 },
  { currency: 'GBP', amount1: -257.6, amount2: -233.5, amount3: -262.9 },
  { currency: 'JPY', amount1: -29.4, amount2: -32.6, amount3: -30.4 },
  { currency: 'NOK', amount1: -44.8, amount2: 9.8, amount3: 34.7 },
  { currency: 'SGD', amount1: -18.5, amount2: -42.9, amount3: -43.1 },
  { currency: 'BRL', amount1: 19.8, amount2: -21.7, amount3: 33.4 },
  { currency: 'CNH', amount1: 109, amount2: 109, amount3: 109 },
  { currency: 'COP', amount1: 0, amount2: 8.7, amount3: 6 },
  { currency: 'KWD', amount1: -36.4, amount2: -36.4, amount3: -36.4 },
  { currency: 'MXN', amount1: -36.3, amount2: -40.2, amount3: -53.7 },
  { currency: 'OMR', amount1: -46.3, amount2: -46.3, amount3: -48.3 },
  { currency: 'RON', amount1: 23.2, amount2: 13.2, amount3: 18.5 },
  { currency: 'RUB', amount1: 22.8, amount2: 2.9, amount3: -14.1 },
  { currency: 'SAR', amount1: -148, amount2: -148, amount3: -148 },
  { currency: 'THB', amount1: -21.6, amount2: -21.6, amount3: -21.6 },
  { currency: 'AUD', amount1: 1500, amount2: -367.1, amount3: -377.5 }
];

const forwardPoints = [
  {
    currency_pair: 'GBPUSD',
    spot_rate: 1.23219,
    time: '7:29:38',
    tenor: '1M',
    bid: -2.34,
    ask: -2.25,
    rate_date: '2025-01-22',
    all_in_bid: 1.231956,
    all_in_ask: 1.231965
  },
  {
    currency_pair: 'GBPUSD',
    spot_rate: 1.23219,
    time: '7:29:24',
    tenor: '3M',
    bid: -5.27,
    ask: -4.83,
    rate_date: '2025-01-22',
    all_in_bid: 1.231663,
    all_in_ask: 1.231707
  },
  {
    currency_pair: 'GBPJPY',
    spot_rate: 192.9875,
    time: '7:00:05',
    tenor: '1M',
    bid: -74.4,
    ask: -74.03,
    rate_date: '2025-01-22',
    all_in_bid: 192.98006,
    all_in_ask: 192.980097
  },
  {
    currency_pair: 'GBPJPY',
    spot_rate: 192.9875,
    time: '7:00:12',
    tenor: '3M',
    bid: -205,
    ask: -203.77,
    rate_date: '2025-01-22',
    all_in_bid: 192.967,
    all_in_ask: 192.967123
  }
];

// Expected output validation (partial, for simplicity)
const expectedOutputKeys = [
  'currency_pair',
  'spot_rate',
  'rate_date',
  '1M',
  '3M',
  'fdv',
  'premiumDiscount',
  'hedgedExposure',
  'bestTenor',
  'oneMonth'
];

describe('enrichRates function', () => {
  it('should process forward points and hedge exposures correctly', () => {
    const result = enrichRates(forwardPoints, hedgeExposures);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((entry) => {
      expectedOutputKeys.forEach((key) => {
        expect(entry).toHaveProperty(key);
      });
    });
  });
});
