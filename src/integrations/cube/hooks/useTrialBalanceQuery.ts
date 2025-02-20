
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

  // Add detailed error logging
  if (error) {
    const cubeError = error as CubeError;
    console.error('Cube.js Connection Error:', {
      message: cubeError.message,
      url: import.meta.env.VITE_CUBEJS_API_URL,
      status: cubeError.response?.status,
      details: cubeError.response?.data
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
    if (error.message?.includes('CONNECTION_REFUSED')) {
      return 'Unable to connect to the Cube.js server. The server appears to be offline or not accessible.';
    }
    if (error.response?.status === 401) {
      return 'Authentication failed. Please check your API credentials.';
    }
    return `Connection Error: ${error.message || 'Unable to reach the Cube.js server. Please verify the server is running and accessible.'}`;
  };

  return {
    data: formattedData,
    isLoading,
    error: getErrorMessage(error as CubeError),
    refetch
  };
};
