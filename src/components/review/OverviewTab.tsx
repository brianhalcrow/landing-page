
import { useState, useEffect } from "react";
import RealtimeSubscription from "./RealtimeSubscription";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradeRequest } from "./types/trade-request.types";

export const OverviewTab = () => {
  const [isMounted, setIsMounted] = useState(true);

  const { data: tradeRequests = [], refetch } = useQuery({
    queryKey: ['trade-requests-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TradeRequest[];
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
      <div className="w-full">
        {/* Charts will be added here */}
        <div className="text-center text-gray-500">
          Charts coming soon...
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
