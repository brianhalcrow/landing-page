import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useTiingoSpotRates from '../../src/rates/SpotRatesWs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries
        staleTime: 0, // Ensure queries are fresh
        cacheTime: 0, // Avoid caching in tests
        refetchOnWindowFocus: false, // Avoid unnecessary refetches
      },
    },
  });
};

const TestComponent = () => {
  const spotRates = useTiingoSpotRates();

  return (
    <div>
      {Object.entries(spotRates).map(([ticker, rate]) => (
        <div key={ticker} data-testid={`spot-rate-${ticker}`}>
          {ticker}: {rate.toFixed(5)}
        </div>
      ))}
    </div>
  );
};

test('should fetch and display spot rates from WebSocket', async () => {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <TestComponent />
    </QueryClientProvider>
  );

  // Wait for WebSocket to connect and fetch spot rates
  await waitFor(
    async () => {
      expect(screen.getByTestId('spot-rate-eurusd')).toBeInTheDocument();
    },
    { timeout: 4000 }
  );

  // Assert the correct spot rates are displayed
  expect(screen.getByTestId('spot-rate-eurusd')).toHaveTextContent(/eurusd: \d+\.\d+/);
});