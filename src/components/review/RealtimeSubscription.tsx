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
          event: '*',
          schema: 'public',
          table: 'pre_trade_sfx_hedge_request'
        },
        (payload) => {
          console.log('📨 Received database change:', payload);
          console.log('Event type:', payload.eventType);
          console.log('Table:', payload.table);
          console.log('Schema:', payload.schema);
          console.log('Payload:', JSON.stringify(payload, null, 2));
          
          toast({
            title: `${payload.eventType} Event`,
            description: `Hedge request ${payload.eventType.toLowerCase()}`,
          });
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
        
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.log('⚠️ Subscription closed or errored:', status);
          toast({
            title: "Connection Lost",
            description: "Lost connection to real-time updates",
            variant: "destructive",
          });
        }
      });

    return () => {
      console.log('🧹 Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  }, [toast, onDataChange]);

  return null;
};

export default RealtimeSubscription;
