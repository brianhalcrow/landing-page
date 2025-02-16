
import { TradeRequest, RequestStatus } from '../../types/trade-request.types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeRequestActions = (onDataChange?: () => void) => {
  const handleApprove = async (request: TradeRequest, targetStatus?: RequestStatus) => {
    const newStatus: RequestStatus = targetStatus || 'Reviewed';
    const updateField = newStatus === 'Reviewed' ? 'reviewed' : 'approved';

    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: newStatus,
        [`${updateField}_by`]: 'Current User', // TODO: Replace with actual user
        [`${updateField}_at`]: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error(`Failed to update request: ${error.message}`);
      return;
    }

    toast.success(`Request ${request.request_no} ${updateField}`);
    onDataChange?.();
  };

  const handleReject = async (request: TradeRequest) => {
    const { error } = await supabase
      .from('trade_requests')
      .update({
        status: 'Rejected' as RequestStatus,
        rejected_by: 'Current User', // TODO: Replace with actual user
        rejected_at: new Date().toISOString()
      })
      .eq('request_no', request.request_no);

    if (error) {
      toast.error(`Failed to reject request: ${error.message}`);
      return;
    }

    toast.success(`Request ${request.request_no} rejected`);
    onDataChange?.();
  };

  return { handleApprove, handleReject };
};
