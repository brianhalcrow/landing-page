
import { useCubeQuery } from "@cubejs-client/react";
import { useMemo } from "react";

export interface TrialBalanceData {
  accountCategory: string;
  movementAmount: number;
}

interface CubeError extends Error {
  response?: {
    status?: number;
    data?: any;
  };
}

export const useTrialBalanceQuery = () => {
  const query = useMemo(
    () => ({
      measures: ["trial_balance.movement_transaction_amount"],
      dimensions: ["trial_balance.account_category_level_4"],
      order: {
        "trial_balance.movement_transaction_amount": "desc" as const
      },
      limit: 10000,
    }),
    []
  );

  const { resultSet, isLoading, error, refetch } = useCubeQuery(query);

  // Enhanced error logging
  if (error) {
    const cubeError = error as CubeError;
    console.error('Cube.js Query Error:', {
      message: cubeError.message,
      url: import.meta.env.VITE_CUBEJS_API_URL,
      status: cubeError.response?.status,
      details: cubeError.response?.data,
      headers: cubeError.response?.headers,
      query: JSON.stringify(query)
    });
  }

  const formattedData = useMemo(() => {
    if (!resultSet) return [];
    return resultSet.tablePivot().map((row) => ({
      accountCategory: row["trial_balance.account_category_level_4"],
      movementAmount: row["trial_balance.movement_transaction_amount"],
    }));
  }, [resultSet]);

  const getErrorMessage = (error: CubeError | null) => {
    if (!error) return null;
    
    // Log the complete error object for debugging
    console.debug('Full Cube.js error object:', error);

    if (error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
      return 'Unable to connect to the data service. This might be due to CORS restrictions. Please contact support.';
    }
    if (error.message?.includes('CONNECTION_REFUSED')) {
      return 'The data service appears to be offline. Please try again later.';
    }
    if (error.response?.status === 401) {
      return 'Authentication failed. Please check your credentials.';
    }
    return `Connection Error: ${error.message || 'Unable to fetch data. Please try again.'}`;
  };

  return {
    data: formattedData,
    isLoading,
    error: getErrorMessage(error as CubeError),
    refetch
  };
};
