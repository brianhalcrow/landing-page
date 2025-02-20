
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

  // Enhanced error logging with CORS detection
  if (error) {
    const cubeError = error as CubeError;
    const isCorsError = error.message?.includes('CORS') || 
                       !cubeError.response?.status || 
                       cubeError.response?.status === 0;

    console.error('Cube.js Query Error:', {
      message: cubeError.message,
      url: import.meta.env.VITE_CUBEJS_API_URL,
      status: cubeError.response?.status,
      details: cubeError.response?.data,
      query: JSON.stringify(query),
      isCorsError,
      origin: window.location.origin
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

    // Enhanced CORS error detection
    if (error.message?.includes('CORS') || (!error.response?.status && error.message?.includes('fetch'))) {
      return `CORS Error: The data service is not configured to accept requests from ${window.location.origin}. Please contact support with this information.`;
    }
    if (error.message?.includes('Failed to fetch')) {
      return 'Unable to connect to the data service. Please check your network connection.';
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
