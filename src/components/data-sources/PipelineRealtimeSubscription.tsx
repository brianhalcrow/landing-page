import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PipelineRealtimeSubscriptionProps {
  onDataChange: () => void;
}

export const PipelineRealtimeSubscription = ({
  onDataChange,
}: PipelineRealtimeSubscriptionProps) => {
  useEffect(() => {
    console.log("🔌 Setting up pipeline executions realtime subscription...");

    const channel = supabase
      .channel("pipeline-executions-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "pipeline_executions",
        },
        async (payload) => {
          console.log("📨 Received pipeline execution change:", payload);
          console.log("Event type:", payload.eventType);
          console.log("Full payload:", JSON.stringify(payload, null, 2));

          // Trigger data refresh immediately
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to pipeline executions updates");
        } else {
          console.log("❌ Subscription status not successful:", status);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🧹 Cleaning up pipeline executions subscription...");
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return null;
};

export default PipelineRealtimeSubscription;