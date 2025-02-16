
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { Dispatch, SetStateAction } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TradeGridToolbarProps {
  entityId?: string | null;
  entityName?: string | null;
  draftId: number;
  rowData: HedgeRequestDraftTrade[];
  setRowData: Dispatch<SetStateAction<HedgeRequestDraftTrade[]>>;
}

const TradeGridToolbar = ({ entityId, entityName, draftId, rowData, setRowData }: TradeGridToolbarProps) => {
  const addRow = () => {
    const newRow: Partial<HedgeRequestDraftTrade> = {
      draft_id: draftId.toString(),
      entity_id: entityId || null,
      entity_name: entityName || null
    };
    setRowData([...rowData, newRow as HedgeRequestDraftTrade]);
  };

  const validateRowData = (data: HedgeRequestDraftTrade[]) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Check both currencies are populated
      if (!row.buy_currency || !row.sell_currency) {
        toast.error(`Row ${i + 1}: Both buy and sell currencies are required`);
        return false;
      }

      // Check exactly one amount is populated
      const hasBuyAmount = row.buy_amount !== null && row.buy_amount !== undefined;
      const hasSellAmount = row.sell_amount !== null && row.sell_amount !== undefined;
      
      if (!hasBuyAmount && !hasSellAmount) {
        toast.error(`Row ${i + 1}: Either buy amount or sell amount must be specified`);
        return false;
      }
      
      if (hasBuyAmount && hasSellAmount) {
        toast.error(`Row ${i + 1}: Only one amount (buy or sell) can be specified, not both`);
        return false;
      }
    }
    return true;
  };

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
    }

    return true;
  };

  const handleSave = async () => {
    try {
      // Run row validation first
      if (!validateRowData(rowData)) {
        return;
      }

      // Then validate swap legs if any
      if (!validateSwapLegs(rowData)) {
        return;
      }

      // Transform data to match database schema
      const transformedData = rowData.map(row => ({
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
        .insert(transformedData);

      if (error) throw error;
      
      toast.success('Trades saved successfully');
      setRowData([]); // Clear the grid after successful save
    } catch (error) {
      console.error('Error saving trades:', error);
      toast.error('Failed to save trades');
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button onClick={addRow} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Trade
      </Button>
      <Button onClick={handleSave} size="sm">
        Save Trades
      </Button>
    </div>
  );
};

export default TradeGridToolbar;
