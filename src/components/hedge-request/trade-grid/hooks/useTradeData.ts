
import { useState } from "react";
import { HedgeRequestDraftTrade } from "../../grid/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeData = () => {
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([]);

  const validateSwapLegs = (data: HedgeRequestDraftTrade[]) => {
    const swapTrades = data.filter(row => row.instrument === 'Swap');
    
    // If there are no swaps, validation passes
    if (swapTrades.length === 0) return true;

    // For swaps, ensure we have pairs of trades
    if (swapTrades.length % 2 !== 0) {
      toast.error('Swaps must have exactly two legs');
      return false;
    }

    // Validate each swap pair
    for (let i = 0; i < swapTrades.length; i += 2) {
      const leg1 = swapTrades[i];
      const leg2 = swapTrades[i + 1];

      // Ensure both legs exist
      if (!leg1 || !leg2) {
        toast.error('Invalid swap configuration');
        return false;
      }

      // Validate currencies match (reversed)
      if (leg1.buy_currency !== leg2.sell_currency || 
          leg1.sell_currency !== leg2.buy_currency) {
        toast.error('Swap legs must have matching currencies');
        return false;
      }

      // Only validate amounts if they are present
      if (leg1.buy_amount !== null && leg2.sell_amount === null) {
        toast.error('Second leg must have sell amount when first leg has buy amount');
        return false;
      }

      if (leg1.sell_amount !== null && leg2.buy_amount === null) {
        toast.error('Second leg must have buy amount when first leg has sell amount');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateSwapLegs(rowData)) {
        return;
      }

      const updatedRowData = [...rowData];
      
      // Save trades one by one to establish relationships for swaps
      for (let i = 0; i < updatedRowData.length; i++) {
        const row = updatedRowData[i];
        const { data, error } = await supabase
          .from('trade_requests')
          .insert({
            ...row,
            created_at: new Date().toISOString(),
            // For swaps, link second leg to first leg
            related_trade_id: row.instrument === 'Swap' && i % 2 === 1 && updatedRowData[i - 1].request_no ? 
              updatedRowData[i - 1].request_no : null
          })
          .select();

        if (error) throw error;

        // Update the request_no in our rowData for the next iteration
        if (data?.[0]) {
          updatedRowData[i] = {
            ...updatedRowData[i],
            request_no: data[0].request_no
          };
        }
      }
      
      toast.success('Trades saved successfully');
      setRowData([]); // Clear the grid after successful save
    } catch (error) {
      console.error('Error saving trades:', error);
      toast.error('Failed to save trades');
    }
  };

  const addRow = () => {
    const newRow: Partial<HedgeRequestDraftTrade> = {
      request_no: null,
      // Initialize with default values
    };
    setRowData([...rowData, newRow as HedgeRequestDraftTrade]);
  };

  const updateRow = (index: number, updates: Partial<HedgeRequestDraftTrade>) => {
    const newData = [...rowData];
    const currentRow = newData[index];
    
    // Basic update without automatic leg creation
    newData[index] = { ...currentRow, ...updates };
    
    setRowData(newData);
  };

  return {
    rowData,
    setRowData,
    handleSave,
    addRow,
    updateRow
  };
};
