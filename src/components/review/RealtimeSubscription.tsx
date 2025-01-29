import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RealtimeSubscriptionProps {
  onDataChange: () => void;
}

export const RealtimeSubscription = ({
  onDataChange,
}: RealtimeSubscriptionProps) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔌 Setting up realtime subscription...");

    const channel = supabase
      .channel("hedge-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "pre_trade_sfx_hedge_request",
        },
        async (payload) => {
          console.log("📨 Received database change:", payload);
          console.log("Event type:", payload.eventType);
          console.log("Full payload:", JSON.stringify(payload, null, 2));

          toast({
            title: `Hedge Request ${payload.eventType}`,
            description: `A hedge request was ${payload.eventType.toLowerCase()}d`,
          });

          // Trigger data refresh to get all rows
          await onDataChange();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime updates");
          toast({
            title: "Connected",
            description: "Real-time updates are now active",
          });
        } else {
          console.log("❌ Subscription status not successful:", status);
          toast({
            title: "Connection Issue",
            description: "Real-time updates may not be working",
            variant: "destructive",
          });
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🧹 Cleaning up subscription...");
      supabase.removeChannel(channel);
    };
  }, [onDataChange, toast]);

  return null;
};

export default RealtimeSubscription;