
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

  const validateTrades = (data: HedgeRequestDraftTrade[]) => {
    const errors: string[] = [];

    // First validate basic trade requirements for all rows
    data.forEach((row, index) => {
      if (!row.buy_currency || !row.sell_currency) {
        errors.push(`Row ${index + 1}: Both buy and sell currencies are required`);
      }

      const hasBuyAmount = row.buy_amount !== null && row.buy_amount !== undefined;
      const hasSellAmount = row.sell_amount !== null && row.sell_amount !== undefined;
      
      if (!hasBuyAmount && !hasSellAmount) {
        errors.push(`Row ${index + 1}: Either buy amount or sell amount must be specified`);
      }
      
      if (hasBuyAmount && hasSellAmount) {
        errors.push(`Row ${index + 1}: Only one amount (buy or sell) can be specified, not both. Please remove either the buy amount or sell amount.`);
      }
    });

    // Then validate swap-specific requirements
    const swapTrades = data.filter(row => row.instrument === 'Swap');
    if (swapTrades.length > 0) {
      if (swapTrades.length % 2 !== 0) {
        errors.push('Swap trades must have exactly two legs (found an odd number of swap trades)');
      } else {
        for (let i = 0; i < swapTrades.length; i += 2) {
          const leg1 = swapTrades[i];
          const leg2 = swapTrades[i + 1];

          if (!leg1 || !leg2) {
            errors.push('Invalid swap configuration: missing leg');
            continue;
          }

          const swapIndex = Math.floor(i / 2) + 1;
          
          // Currency matching
          if (leg1.buy_currency !== leg2.sell_currency || leg1.sell_currency !== leg2.buy_currency) {
            errors.push(`Swap ${swapIndex}: Currencies must match between legs (leg 1 buy/sell should match leg 2 sell/buy)`);
          }

          // Amount validation for each leg
          const leg1HasBuyAmount = leg1.buy_amount !== null && leg1.buy_amount !== undefined;
          const leg1HasSellAmount = leg1.sell_amount !== null && leg1.sell_amount !== undefined;
          const leg2HasBuyAmount = leg2.buy_amount !== null && leg2.buy_amount !== undefined;
          const leg2HasSellAmount = leg2.sell_amount !== null && leg2.sell_amount !== undefined;

          if (leg1HasBuyAmount && leg1HasSellAmount) {
            errors.push(`Swap ${swapIndex} Leg 1: Only one amount (buy or sell) can be specified, not both`);
          }

          if (leg2HasBuyAmount && leg2HasSellAmount) {
            errors.push(`Swap ${swapIndex} Leg 2: Only one amount (buy or sell) can be specified, not both`);
          }

          if (!leg1HasBuyAmount && !leg1HasSellAmount) {
            errors.push(`Swap ${swapIndex} Leg 1: Must specify either buy amount or sell amount`);
          }

          if (!leg2HasBuyAmount && !leg2HasSellAmount) {
            errors.push(`Swap ${swapIndex} Leg 2: Must specify either buy amount or sell amount`);
          }
        }
      }
    }

    return errors;
  };

  const handleSave = async () => {
    try {
      const validationErrors = validateTrades(rowData);
      if (validationErrors.length > 0) {
        toast.error(validationErrors.join('\n'));
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
