
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { toast } from 'sonner';

export const useTradeData = (draftId: number, emptyRow: HedgeRequestDraftTrade) => {
  return useQuery({
    queryKey: ['draft-trades', draftId],
    queryFn: async () => {
      console.log('Fetching trades for draft:', draftId);
      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId.toString());

      if (error) {
        console.error('Error fetching trades:', error);
        toast.error('Error fetching trades');
        throw error;
      }

      if (!data?.length) {
        console.log('No trades found, using empty row');
        return [emptyRow];
      }

      return data as HedgeRequestDraftTrade[];
    }
  });
};
