
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { Dispatch, SetStateAction } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAllTrades } from '../validation/tradeValidation';

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

  const handleSave = async () => {
    try {
      // Validate all trades before saving
      const validation = validateAllTrades(rowData);
      
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
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

      const { error } = await supabase
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
