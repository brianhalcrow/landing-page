import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RealtimeSubscriptionProps {
  onDataChange: () => void;
}

const RealtimeSubscription = ({ onDataChange }: RealtimeSubscriptionProps) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔌 Setting up realtime subscription...');
    
    const channel = supabase
      .channel('hedge-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'pre_trade_sfx_hedge_request'
        },
        async (payload) => {
          console.log('📨 Received database change:', payload);
          console.log('Event type:', payload.eventType);
          
          // Show a toast notification for the event
          toast({
            title: `Hedge Request ${payload.eventType}`,
            description: `A hedge request was ${payload.eventType.toLowerCase()}d`,
          });
          
          // Trigger data refresh to get all rows
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime updates');
          toast({
            title: "Connected",
            description: "Real-time updates are now active",
          });
        }
      });

    return () => {
      console.log('🧹 Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  }, [onDataChange, toast]);

  return null;
};

export default RealtimeSubscription;