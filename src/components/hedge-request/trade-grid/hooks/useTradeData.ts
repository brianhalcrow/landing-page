
import { useState } from "react";
import { HedgeRequestDraftTrade } from "../../grid/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeData = () => {
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([]);

  const validateSwapLegs = (data: HedgeRequestDraftTrade[]) => {
    const errors: string[] = [];
    const swapTrades = data.filter(row => row.instrument === 'Swap');
    
    // If there are no swaps, validation passes
    if (swapTrades.length === 0) return true;

    // For swaps, ensure we have pairs of trades
    if (swapTrades.length % 2 !== 0) {
      errors.push('Swaps must have exactly two legs');
      toast.error(errors.join('\n'));
      return false;
    }

    // Validate each swap pair
    for (let i = 0; i < swapTrades.length; i += 2) {
      const leg1 = swapTrades[i];
      const leg2 = swapTrades[i + 1];

      // Ensure both legs exist
      if (!leg1 || !leg2) {
        errors.push('Invalid swap configuration');
        toast.error(errors.join('\n'));
        return false;
      }

      // Validate currencies match (reversed)
      if (leg1.buy_currency !== leg2.sell_currency || 
          leg1.sell_currency !== leg2.buy_currency) {
        errors.push('Invalid swap configuration');
        toast.error(errors.join('\n'));
        return false;
      }

      // Only validate amounts if they are present
      if (leg1.buy_amount !== null && leg2.sell_amount === null) {
        errors.push('Second leg must have sell amount when first leg has buy amount');
        toast.error(errors.join('\n'));
        return false;
      }

      if (leg1.sell_amount !== null && leg2.buy_amount === null) {
        errors.push('Second leg must have buy amount when first leg has sell amount');
        toast.error(errors.join('\n'));
        return false;
      }
    }

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateSwapLegs(rowData)) {
        return;
      }

      // Transform data to match database schema
      const transformedData = rowData.map((row, index) => ({
        draft_id: row.draft_id,
        entity_id: row.entity_id,
        entity_name: row.entity_name,
        ccy_1: row.buy_currency,
        ccy_2: row.sell_currency,
        ccy_1_amount: row.buy_amount,
        ccy_2_amount: row.sell_amount,
        trade_date: row.trade_date,
        settlement_date: row.settlement_date,
        cost_centre: row.cost_centre,
        counterparty_name: row.counterparty_name,
        instrument: row.instrument,
        strategy_name: row.strategy_name,
        created_at: new Date().toISOString()
      }));
      
      const { data, error } = await supabase
        .from('trade_requests')
        .insert(transformedData)
        .select();

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
