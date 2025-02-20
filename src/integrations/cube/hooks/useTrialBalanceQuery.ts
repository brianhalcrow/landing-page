
import { useQuery } from "@cubejs-client/react";
import { useMemo } from "react";

export interface TrialBalanceData {
  account_category_level_4: string;
  movement_transaction_amount: number;
}

export const useTrialBalanceQuery = () => {
  const query = useMemo(
    () => ({
      measures: ["trial_balance.movement_transaction_amount"],
      dimensions: ["trial_balance.account_category_level_4"],
      limit: 10000,
    }),
    []
  );

  return useQuery(query);
};
