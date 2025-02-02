import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { parse, format, isValid } from 'date-fns';

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

  const validateTrade = (trade: HedgeRequestDraftTrade): boolean => {
    if (!trade.trade_date || !trade.settlement_date) {
      toast.error('Trade and settlement dates are required');
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

  const formatDateForDB = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      // Parse the date from DD/MM/YYYY format
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      
      if (!isValid(parsedDate)) {
        console.error('Invalid date:', dateStr);
        return null;
      }
      
      // Format the date as YYYY-MM-DD for the database
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleSaveTrades = async () => {
    try {
      console.log('Saving trades with data:', rowData);
      
      // Validate all trades before saving
      const isValid = rowData.every(validateTrade);
      if (!isValid) {
        return;
      }
      
      // Format and validate the data before sending to Supabase
      const formattedData = rowData.map(row => {
        const tradeDate = formatDateForDB(row.trade_date);
        const settlementDate = formatDateForDB(row.settlement_date);
        
        // Ensure amounts are numbers
        const buyAmount = typeof row.buy_amount === 'string' 
          ? parseFloat(row.buy_amount) 
          : row.buy_amount;
        
        const sellAmount = typeof row.sell_amount === 'string'
          ? parseFloat(row.sell_amount)
          : row.sell_amount;

        return {
          ...row,
          draft_id: draftId.toString(),
          trade_date: tradeDate,
          settlement_date: settlementDate,
          buy_amount: buyAmount || 0,
          sell_amount: sellAmount || 0
        };
      });

      console.log('Formatted data to save:', formattedData);

      const { error } = await supabase
        .from('hedge_request_draft_trades')
        .insert(formattedData);

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