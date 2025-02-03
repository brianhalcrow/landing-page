import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { validateTrade } from '../utils/tradeValidation';

interface TradeGridToolbarProps {
  draftId: number;
  rowData: HedgeRequestDraftTrade[];
  setRowData: (data: HedgeRequestDraftTrade[]) => void;
}

const TradeGridToolbar = ({ draftId, rowData, setRowData }: TradeGridToolbarProps) => {
  const handleAddRow = () => {
    const newRow: Omit<HedgeRequestDraftTrade, 'id'> = {
      draft_id: draftId.toString(),
      buy_currency: null,
      sell_currency: null,
      trade_date: null,
      settlement_date: null,
      buy_amount: null,
      sell_amount: null,
      entity_id: null,
      entity_name: null,
      created_at: null,
      updated_at: null,
      spot_rate: null,
      contract_rate: null
    };
    setRowData([...rowData, newRow as HedgeRequestDraftTrade]);
  };

  const handleSaveTrades = async () => {
    try {
      console.log('Saving trades with data:', rowData);
      
      // Validate all trades before saving
      const isValid = rowData.every(validateTrade);
      if (!isValid) {
        return;
      }

      // Remove ids and calculated fields before saving
      const tradesForSaving = rowData.map(({ id, spot_rate, contract_rate, ...trade }) => trade);

      const { error } = await supabase
        .from('hedge_request_draft_trades')
        .insert(tradesForSaving);

      if (error) throw error;
      
      toast.success('Trades saved successfully');
    } catch (error) {
      console.error('Error saving trades:', error);
      toast.error('Failed to save trades');
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button onClick={handleAddRow} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Trade
      </Button>
      <Button onClick={handleSaveTrades} size="sm">
        Save Trades
      </Button>
    </div>
  );
};

export default TradeGridToolbar;