
import { useState, useEffect } from "react";
import RealtimeSubscription from "./RealtimeSubscription";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TradeRequestsGrid } from "./components/TradeRequestsGrid";
import { GridStyles } from "../shared/grid/GridStyles";
import { TradeRequest } from "./types/trade-request.types";

export const ReviewedTab = () => {
  const [isMounted, setIsMounted] = useState(true);

  const { data: tradeRequests = [], refetch } = useQuery({
    queryKey: ['trade-requests-reviewed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .eq('status', 'Reviewed')
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
    console.log("🏁 ReviewedTab mounted");
    refetch();

    return () => {
      console.log("🔚 ReviewedTab unmounted");
    };
  }, [refetch]);

  return (
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={refetch} />
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <TradeRequestsGrid 
          rowData={tradeRequests} 
          showApproveButton={true}
          showRejectButton={true}
          targetStatus="Approved"
        />
      </div>
    </div>
  );
};

export default ReviewedTab;
