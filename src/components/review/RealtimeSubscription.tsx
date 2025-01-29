import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RealtimeSubscriptionProps {
  onDataChange: () => void;
}

const RealtimeSubscription = ({ onDataChange }: RealtimeSubscriptionProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('hedge-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pre_trade_sfx_hedge_request'
        },
        (payload) => {
          console.log('📨 Database change received:', payload.eventType);
          onDataChange();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
        }
      });

    return () => {
      console.log('🧹 Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return null;
};

export default RealtimeSubscription;