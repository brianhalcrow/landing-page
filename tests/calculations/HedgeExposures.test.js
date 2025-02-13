import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useHedgeExposures from '../../src/rates/HedgeExposures';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useHedgeExposures - Live API Call', () => {
  it('should fetch and display the live data from the API', async () => {
    const { result } = renderHook(() => useHedgeExposures(), { wrapper });

    // Ensure query is in loading state initially
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 10000 });

    // Log the live data to the console
    console.log('API Response:', result.current.data);

    // Ensure data exists
    expect(result.current.data).toBeDefined();
  });
});
