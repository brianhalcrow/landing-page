
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
  swap_id?: string;
  swap_leg?: 1 | 2;
}

export const useTradeRequestSave = () => {
  return useMutation({
    mutationFn: async (data: TradeRequest | TradeRequest[]) => {
      console.log("Saving trade request(s):", data);
      
      // If it's a single request, wrap it in an array
      const requests = Array.isArray(data) ? data : [data];
      
      // Group trades by swap_id
      const swapGroups = new Map<string | undefined, TradeRequest[]>();
      requests.forEach(request => {
        const key = request.swap_id || `single-${request.entity_id}-${Date.now()}`;
        const group = swapGroups.get(key) || [];
        group.push(request);
        swapGroups.set(key, group);
      });

      // Validate and prepare trades for saving
      const requestsToSave: TradeRequest[] = [];
      
      for (const [swap_id, group] of swapGroups) {
        // For swaps, ensure we have both legs
        if (group[0]?.instrument?.toLowerCase() === 'swap') {
          if (group.length !== 2) {
            throw new Error(`Incomplete swap pair for ${group[0]?.entity_name}`);
          }

          // Sort legs by leg number
          group.sort((a, b) => (a.swap_leg || 0) - (b.swap_leg || 0));
          
          // For swaps, let the database generate the hedge_group_id
          group.forEach(leg => {
            requestsToSave.push({
              ...leg,
              hedge_group_id: null // Let database sequence handle this
            });
          });
        } else {
          // For non-swaps, just add them as is
          requestsToSave.push(...group);
        }
      }

      console.log("Saving trades:", requestsToSave);

      try {
        // First, try to save the trades
        const { data: savedData, error } = await supabase
          .from('trade_requests')
          .insert(requestsToSave)
          .select();

        if (error) {
          console.error("Error saving trade request:", error);
          throw error;
        }

        if (!savedData) {
          throw new Error("No data returned from save operation");
        }

        // Return the saved data
        return savedData;
      } catch (error) {
        console.error("Error in save operation:", error);
        throw new Error("Failed to save trade request");
      }
    }
  });
};
