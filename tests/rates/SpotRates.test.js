import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useSpotRatesData from '../../src/rates/SpotRates';
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
  const { data, error, isLoading } = useSpotRatesData();

  if (isLoading) {
    console.log('Loading...');
    return <div>Loading...</div>;
  }
  if (error) {
    console.error('Error:', error);
    return <div>Error: {error.message}</div>;
  }

  console.log('Data:', data);
  return <div>{JSON.stringify(data)}</div>;
};

test('should fetch forward points data', async () => {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <TestComponent />
    </QueryClientProvider>
  );

  console.log('Initial screen state:');
  screen.debug();

  expect(await screen.findByText(/Loading/)).toBeInTheDocument();
  console.log('Screen after loading:');
  screen.debug();

  // Ensure we wait for the data to load
  await waitFor(() => {
    expect(screen.getByText(/eurusd/)).toBeInTheDocument(); // Known response key
  });

  // Log the final state of the screen
  console.log('Final screen state:');
  screen.debug();
});
