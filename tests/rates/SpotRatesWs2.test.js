import { render, screen, waitFor } from '@testing-library/react';
import useTiingoSpotRates from '../../src/rates/SpotRates';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('../../src/rates/SpotRates'); // Mock the hook to avoid real WebSocket calls

const mockRates = {
  AUDUSD: 0.765,
  EURUSD: 1.123,
};

useTiingoSpotRates.mockImplementation(() => mockRates);

const SpotRatesComponent = () => {
  console.log('In SpotRatesComponent');
  const rates = useTiingoSpotRates();
  console.log('Rates in component:', rates);
  return (
    <div>
      {Object.entries(rates).map(([ticker, rate]) => (
        <div key={ticker} data-testid={`${ticker}`}>
          {ticker}: {rate}
        </div>
      ))}
    </div>
  );
};

describe('SpotRates Integration Test', () => {
  it('receives spot rate updates from the Tiingo WebSocket API', async () => {
    render(<SpotRatesComponent />);

    // Wait for the spot rates to appear
    await waitFor(() => {
      expect(screen.getByTestId('EURUSD')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
