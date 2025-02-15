
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTradeData } from '../hooks/useTradeData';

interface TradeGridToolbarProps {
  entityId?: string | null;
  entityName?: string | null;
}

const TradeGridToolbar = ({ entityId, entityName }: TradeGridToolbarProps) => {
  const { handleSave, addRow } = useTradeData();

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
