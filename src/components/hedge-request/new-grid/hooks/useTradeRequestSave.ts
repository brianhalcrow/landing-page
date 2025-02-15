
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
  leg_number: number | null;
  swap_reference?: string | null;
}

export const useTradeRequestSave = () => {
  return useMutation({
    mutationFn: async (data: TradeRequest) => {
      console.log("Saving trade request:", data);
      
      const { error } = await supabase
        .from('trade_requests')
        .insert([data]);

      if (error) {
        console.error("Error saving trade request:", error);
        throw error;
      }

      return true;
    }
  });
};
