import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';

interface TradeGridToolbarProps {
  draftId: number;
  rowData: HedgeRequestDraftTrade[];
  setRowData: (data: HedgeRequestDraftTrade[]) => void;
}

const TradeGridToolbar = ({ draftId, rowData, setRowData }: TradeGridToolbarProps) => {
  const handleAddRow = () => {
    const newRow: HedgeRequestDraftTrade = {
      draft_id: draftId.toString(),
      buy_currency: '',
      sell_currency: '',
      currency_pair: '',
      trade_date: '',
      settlement_date: '',
      buy_amount: 0,
      sell_amount: 0
    };
    setRowData([...rowData, newRow]);
  };

  const validateDate = (dateStr: string): boolean => {
    // Check if date is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return false;
    }
    
    // Check if it's a valid date
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateTrade = (trade: HedgeRequestDraftTrade): boolean => {
    if (!trade.trade_date || !trade.settlement_date) {
      toast.error('Trade and settlement dates are required');
      return false;
    }

    if (!validateDate(trade.trade_date) || !validateDate(trade.settlement_date)) {
      toast.error('Dates must be in YYYY-MM-DD format');
      return false;
    }

    if (!trade.buy_currency || !trade.sell_currency) {
      toast.error('Buy and sell currencies are required');
      return false;
    }

    if (!trade.buy_amount && !trade.sell_amount) {
      toast.error('Either buy or sell amount is required');
      return false;
    }

    return true;
  };

  const handleSaveTrades = async () => {
    try {
      console.log('Saving trades with data:', rowData);
      
      // Validate all trades before saving
      const isValid = rowData.every(validateTrade);
      if (!isValid) {
        return;
      }

      const { error } = await supabase
        .from('hedge_request_draft_trades')
        .insert(rowData);

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