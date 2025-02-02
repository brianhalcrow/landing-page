import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TradeDataGrid from "./TradeDataGrid";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  draftId: number;
}

const TradeDialog = ({ isOpen, onClose, draftId }: TradeDialogProps) => {
  // Fetch latest rates
  const { data: rates } = useQuery({
    queryKey: ['rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rates')
        .select('*')
        .order('rate_date', { ascending: false });

      if (error) {
        console.error('Error fetching rates:', error);
        throw error;
      }

      // Create a map of currency pairs to their latest rates
      const latestRates = new Map();
      data?.forEach(rate => {
        const pair = `${rate.base_currency}/${rate.quote_currency}`;
        if (!latestRates.has(pair)) {
          latestRates.set(pair, rate.closing_rate);
        }
      });

      return latestRates;
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1200px]">
        <DialogHeader>
          <DialogTitle>Add Trades for Draft #{draftId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <TradeDataGrid draftId={draftId} rates={rates} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDialog;