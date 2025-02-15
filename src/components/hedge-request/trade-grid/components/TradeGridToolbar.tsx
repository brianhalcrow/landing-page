
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
      if (!validateSwapLegs(rowData)) {
        return;
      }

      const { data, error } = await supabase
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
