
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

      // Set leg numbers
      leg1.leg_number = 1;
      leg2.leg_number = 2;

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

      const { error } = await supabase
        .from('trade_requests')
        .insert(rowData.map(row => ({
          ...row,
          created_at: new Date().toISOString()
        })));

      if (error) throw error;
      
      toast.success('Trades saved successfully');
      setRowData([]); // Clear the grid after successful save
    } catch (error) {
      console.error('Error saving trades:', error);
      toast.error('Failed to save trades');
    }
  };

  const addRow = () => {
    const newRow: Partial<HedgeRequestDraftTrade> = {
      // Initialize with default values
    };
    setRowData([...rowData, newRow as HedgeRequestDraftTrade]);
  };

  const updateRow = (index: number, updates: Partial<HedgeRequestDraftTrade>) => {
    const newData = [...rowData];
    const currentRow = newData[index];
    const wasSwapBefore = currentRow.instrument === 'Swap';
    const isSwapNow = updates.instrument === 'Swap';
    
    // Update the current row
    newData[index] = { ...currentRow, ...updates };

    // Only handle swap pairing if this is a new swap or we're updating an existing swap
    if (isSwapNow) {
      const isFirstLeg = index % 2 === 0;
      const hasSecondLeg = newData[index + 1]?.instrument === 'Swap';

      // Add second leg only if this is first leg and there's no second leg yet
      if (isFirstLeg && !hasSecondLeg && !wasSwapBefore) {
        newData[index + 1] = {
          ...newData[index],
          buy_currency: newData[index].sell_currency,
          sell_currency: newData[index].buy_currency,
          buy_amount: newData[index].sell_amount,
          sell_amount: newData[index].buy_amount,
          leg_number: 2,
          instrument: 'Swap'
        };
      }
      // If this is second leg, just update currencies to match first leg
      else if (!isFirstLeg) {
        newData[index].buy_currency = newData[index - 1].sell_currency;
        newData[index].sell_currency = newData[index - 1].buy_currency;
      }
    }

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
