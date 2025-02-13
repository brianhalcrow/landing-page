
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';

interface TradeGridToolbarProps {
  draftId: number;
  rowData: HedgeRequestDraftTrade[];
  setRowData: (data: HedgeRequestDraftTrade[]) => void;
  entityId?: string | null;
  entityName?: string | null;
}

const TradeGridToolbar = ({ draftId, rowData, setRowData, entityId, entityName }: TradeGridToolbarProps) => {
  const handleAddRow = () => {
    const newRow: Partial<HedgeRequestDraftTrade> = {
      draft_id: draftId.toString(),
      entity_id: entityId || null,
      entity_name: entityName || null
    };
    setRowData([...rowData, newRow as HedgeRequestDraftTrade]);
  };

  const handleSaveTrades = async () => {
    try {
      console.log('Saving trades with data:', rowData);
      
      const tradesForSaving = rowData.map(({ id, ...trade }) => ({
        ...trade,
        created_at: trade.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

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
