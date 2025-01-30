import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HedgeRequest } from "./types";
import PositionsGrid from "./PositionsGrid";
import RealtimeSubscription from "./RealtimeSubscription";

export const PositionsTab = () => {
  const [hedgeRequests, setHedgeRequests] = useState<HedgeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests for positions...");
      setIsLoading(true);

      const { data, error } = await supabase
        .from("hedge_request")
        .select("*")
        .order("trade_request_id", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("❌ Error fetching data:", error);
        throw error;
      }

      const hedgeRequestsWithId = (data || []).map((request) => ({
        ...request,
        id: `hr-${Date.now()}-${Math.random()}`,
      }));

      console.log("✅ Fetched hedge requests for positions:", hedgeRequestsWithId);
      setHedgeRequests(hedgeRequestsWithId);
    } catch (error) {
      console.error("❌ Error in fetchHedgeRequests:", error);
      if (isMounted) {
        toast.error("Failed to fetch hedge request data");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    console.log("🏁 PositionsTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 PositionsTab unmounted");
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
        <PositionsGrid 
          hedgeRequests={hedgeRequests}
        />
      )}
    </div>
  );
};

export default PositionsTab;