import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { format, parse, isValid } from 'date-fns';

interface TradeGridToolbarProps {
  draftId: number;
  rowData: HedgeRequestDraftTrade[];
  setRowData: (data: HedgeRequestDraftTrade[]) => void;
}

const TradeGridToolbar = ({ draftId, rowData, setRowData }: TradeGridToolbarProps) => {
  const handleAddRow = () => {
    const newRow: HedgeRequestDraftTrade = {
      draft_id: draftId.toString(),
      base_currency: '',
      quote_currency: '',
      currency_pair: '',
      trade_date: '',
      settlement_date: '',
      buy_sell: 'BUY',
      buy_sell_currency_code: '',
      buy_sell_amount: 0
    };
    setRowData([...rowData, newRow]);
  };

  const formatDateForDB = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      // Parse the date from DD/MM/YYYY format
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      
      // Check if the date is valid before formatting
      if (!isValid(parsedDate)) {
        console.error('Invalid date:', dateStr);
        return null;
      }
      
      // Format it to YYYY-MM-DD for PostgreSQL
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleSaveTrades = async () => {
    try {
      // Format and validate the data before sending to Supabase
      const formattedData = rowData.map(row => {
        const tradeDate = formatDateForDB(row.trade_date);
        const settlementDate = formatDateForDB(row.settlement_date);
        
        // Ensure buy_sell_amount is a number
        const amount = typeof row.buy_sell_amount === 'string' 
          ? parseFloat(row.buy_sell_amount) 
          : row.buy_sell_amount;

        return {
          ...row,
          draft_id: draftId.toString(),
          trade_date: tradeDate,
          settlement_date: settlementDate,
          buy_sell_amount: amount || 0
        };
      });

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