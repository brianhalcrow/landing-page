
import { useState, useEffect } from "react";
import RealtimeSubscription from "./RealtimeSubscription";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HedgeRequestsGrid } from "./components/HedgeRequestsGrid";

export const OverviewTab = () => {
  const [isMounted, setIsMounted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tradeRequests = [], refetch } = useQuery({
    queryKey: ['trade-requests-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isMounted
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    refetch();

    return () => {
      console.log("🔚 OverviewTab unmounted");
    };
  }, [refetch]);

  return (
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={refetch} />
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <span>Loading trade requests...</span>
        </div>
      ) : (
        <HedgeRequestsGrid rowData={tradeRequests} />
      )}
    </div>
  );
};

export default OverviewTab;
