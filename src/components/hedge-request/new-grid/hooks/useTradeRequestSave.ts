
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateTradeRequest, transformTradeRequest } from "../utils/tradeRequestUtils";

export const useTradeRequestSave = () => {
  const saveMutation = useMutation({
    mutationFn: async (rowData: any) => {
      if (!validateTradeRequest(rowData)) {
        throw new Error("Validation failed");
      }

      const transformedData = transformTradeRequest(rowData);
      
      console.log("Saving trade request:", transformedData);

      // Convert dates to ISO string format
      const dataToSave = {
        ...transformedData,
        trade_date: transformedData.trade_date?.toISOString().split('T')[0],
        settlement_date: transformedData.settlement_date?.toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('trade_requests')
        .insert([dataToSave])
        .select();

      if (error) {
        console.error("Error saving trade request:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Trade request saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save trade request: ${error.message}`);
    }
  });

  return saveMutation;
};
