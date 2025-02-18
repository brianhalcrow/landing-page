
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TradeRequest {
  entity_id: string;
  entity_name: string;
  strategy_name: string;
  instrument: string;
  trade_date: string | null;
  settlement_date: string;
  ccy_1: string | null;
  ccy_2: string | null;
  ccy_1_amount: number | null;
  ccy_2_amount: number | null;
  cost_centre: string;
  ccy_pair: string | null;
  counterparty_name: string | null;
  hedge_group_id?: number | null;
  swapId?: string;
  swapLeg?: 1 | 2;
}

export const useTradeRequestSave = () => {
  return useMutation({
    mutationFn: async (data: TradeRequest | TradeRequest[]) => {
      console.log("Saving trade request(s):", data);
      
      // If it's a single request, wrap it in an array
      const requests = Array.isArray(data) ? data : [data];
      
      // Filter out any undefined or invalid requests
      const validRequests = requests.filter(request => {
        return request.entity_id && request.strategy_name && request.instrument;
      });

      if (validRequests.length === 0) {
        throw new Error("No valid trade requests to save");
      }

      // Group swap legs together by assigning them the same hedge_group_id
      let currentGroupId: number | null = null;
      const requestsToSave = validRequests.map((request, index) => {
        // If this is part of a swap (has swapId)
        if (request.swapId) {
          // If this is the first leg or we don't have a current group ID, get a new one
          if (request.swapLeg === 1 || !currentGroupId) {
            // We'll use a temporary negative number as a placeholder
            // The actual ID will be assigned by the database
            currentGroupId = -(Date.now() + index);
          }
          return { ...request, hedge_group_id: currentGroupId };
        }
        // Reset group ID for non-swap trades
        currentGroupId = null;
        return request;
      });

      console.log("Saving trades:", requestsToSave);

      // Insert the trades - the database will assign real hedge_group_ids
      const { error } = await supabase
        .from('trade_requests')
        .insert(requestsToSave);

      if (error) {
        console.error("Error saving trade request:", error);
        throw error;
      }

      return true;
    }
  });
};
