import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { HedgeRequest } from "./types";
import HedgeRequestsGrid from "./HedgeRequestsGrid";
import RealtimeSubscription from "./RealtimeSubscription";

export const OverviewTab = () => {
  const [hedgeRequests, setHedgeRequests] = useState<HedgeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Track mount status to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests...");
      setIsLoading(true);

      const { data, error } = await supabase
        .from("pre_trade_sfx_hedge_request")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("❌ Error fetching data:", error);
        throw error;
      }

      const hedgeRequestsWithId = (data || []).map((request) => ({
        ...request,
        // Use existing ID or generate a unique one if needed
        id:
          request.id ||
          request.hedge_request_id ||
          `hr-${Date.now()}-${Math.random()}`,
      }));

      console.log("✅ Fetched hedge requests:", hedgeRequestsWithId);
      setHedgeRequests(hedgeRequestsWithId);
    } catch (error) {
      console.error("❌ Error in fetchHedgeRequests:", error);
      if (isMounted) {
        toast({
          title: "Error",
          description: "Failed to fetch hedge request data",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [toast, isMounted]);

  // Debug log for state updates
  useEffect(() => {
    console.log("💾 Hedge requests state updated:", hedgeRequests);
  }, [hedgeRequests]);

  // Initial data fetch
  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 OverviewTab unmounted");
    };
  }, [fetchHedgeRequests]);

  return (
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={fetchHedgeRequests} />
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <span>Loading hedge requests...</span>
        </div>
      ) : (
        <HedgeRequestsGrid 
          hedgeRequests={hedgeRequests}
          // Remove the key prop since it's causing type issues
          // If you need to force re-render, consider a different approach
        />
      )}
    </div>
  );
};

export default OverviewTab;