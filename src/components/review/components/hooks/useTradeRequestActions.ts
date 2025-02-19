
import { TradeRequest, RequestStatus } from '../../types/trade-request.types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTradeRequestActions = (onDataChange?: () => void) => {
  const handleApprove = async (request: TradeRequest, targetStatus?: RequestStatus) => {
    const newStatus: RequestStatus = targetStatus || 'Reviewed';
    const updateField = newStatus === 'Reviewed' ? 'reviewed' : 'approved';

    let query = supabase
      .from('trade_requests')
      .update({
        status: newStatus,
        [`${updateField}_by`]: 'Current User', // TODO: Replace with actual user
        [`${updateField}_at`]: new Date().toISOString()
      });

    // For swaps, we need to update both legs together
    if (request.instrument?.toLowerCase() === 'swap') {
      // If this is a swap, use hedge_group_id to update both legs
      if (!request.hedge_group_id) {
        toast.error('Cannot process swap: Missing hedge group ID');
        return;
      }
      query = query.eq('hedge_group_id', request.hedge_group_id);
    } else {
      // For non-swaps, just update the individual request
      query = query.eq('request_no', request.request_no);
    }

    const { error } = await query;

    if (error) {
      toast.error(`Failed to update request: ${error.message}`);
      throw error;
    }

    toast.success(
      request.instrument?.toLowerCase() === 'swap' 
        ? `Swap trade request ${request.request_no} and its paired leg ${updateField}`
        : `Request ${request.request_no} ${updateField}`
    );
    onDataChange?.();
  };

  const handleReject = async (request: TradeRequest) => {
    let query = supabase
      .from('trade_requests')
      .update({
        status: 'Rejected' as RequestStatus,
        rejected_by: 'Current User', // TODO: Replace with actual user
        rejected_at: new Date().toISOString()
      });

    // For swaps, we need to reject both legs together
    if (request.instrument?.toLowerCase() === 'swap') {
      // If this is a swap, use hedge_group_id to reject both legs
      if (!request.hedge_group_id) {
        toast.error('Cannot process swap: Missing hedge group ID');
        return;
      }
      query = query.eq('hedge_group_id', request.hedge_group_id);
    } else {
      // For non-swaps, just reject the individual request
      query = query.eq('request_no', request.request_no);
    }

    const { error } = await query;

    if (error) {
      toast.error(`Failed to reject request: ${error.message}`);
      throw error;
    }

    toast.success(
      request.instrument?.toLowerCase() === 'swap' 
        ? `Swap trade request ${request.request_no} and its paired leg rejected`
        : `Request ${request.request_no} rejected`
    );
    onDataChange?.();
  };

  return { handleApprove, handleReject };
};
