import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PipelineRealtimeSubscriptionProps {
  onDataChange: () => void;
}

export const PipelineRealtimeSubscription = ({
  onDataChange,
}: PipelineRealtimeSubscriptionProps) => {
  useEffect(() => {
    const channel = supabase
      .channel("pipeline-executions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pipeline_executions",
        },
        async () => {
          onDataChange();
        }
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Pipeline executions subscription failed:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return null;
};

export default PipelineRealtimeSubscription;