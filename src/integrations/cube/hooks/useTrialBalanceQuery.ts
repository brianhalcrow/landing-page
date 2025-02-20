
import { useCubeQuery } from "@cubejs-client/react";
import { useMemo } from "react";

export interface TrialBalanceData {
  accountCategory: string;
  movementAmount: number;
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

  const { resultSet, isLoading, error, refetch } = useCubeQuery(query, {
    retry: 3,
    retryDelay: 1000,
  });

  const formattedData = useMemo(() => {
    if (!resultSet) return [];
    return resultSet.tablePivot().map((row) => ({
      accountCategory: row["trial_balance.account_category_level_4"],
      movementAmount: row["trial_balance.movement_transaction_amount"],
    }));
  }, [resultSet]);

  return {
    data: formattedData,
    isLoading,
    error: error ? `Error connecting to data source: ${error.message || 'Connection failed'}` : null,
    refetch
  };
};
