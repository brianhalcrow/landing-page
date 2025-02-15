
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
  swap_reference?: string | null;
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

      const { error } = await supabase
        .from('trade_requests')
        .insert(validRequests);

      if (error) {
        console.error("Error saving trade request:", error);
        throw error;
      }

      return true;
    }
  });
};
