
import { useState, useEffect } from "react";
import RealtimeSubscription from "./RealtimeSubscription";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HedgeRequestsGrid } from "./components/HedgeRequestsGrid";
import { GridStyles } from "../shared/grid/GridStyles";

export const OverviewTab = () => {
  const [isMounted, setIsMounted] = useState(true);

  const { data: hedgeRequests = [], refetch } = useQuery({
    queryKey: ['hedge-requests-overview'],
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
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <HedgeRequestsGrid rowData={hedgeRequests} />
      </div>
    </div>
  );
};

export default OverviewTab;
