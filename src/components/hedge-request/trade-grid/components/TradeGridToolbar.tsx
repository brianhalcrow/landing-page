import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { format, parse } from 'date-fns';

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
      // Format it to YYYY-MM-DD for PostgreSQL
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleSaveTrades = async () => {
    try {
      // Format the data before sending to Supabase
      const formattedData = rowData.map(row => ({
        ...row,
        trade_date: formatDateForDB(row.trade_date),
        settlement_date: formatDateForDB(row.settlement_date)
      }));

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