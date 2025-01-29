import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RealtimeSubscriptionProps {
  onDataChange: () => void;
}

export const RealtimeSubscription = ({
  onDataChange,
}: RealtimeSubscriptionProps) => {
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

          // Trigger data refresh to get all rows
          await onDataChange();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime updates");
        } else {
          console.log("❌ Subscription status not successful:", status);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🧹 Cleaning up subscription...");
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return null;
};

export default RealtimeSubscription;