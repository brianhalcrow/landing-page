import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { HedgeRequest } from "./types";
import HedgeRequestsGrid from "./HedgeRequestsGrid";
import RealtimeSubscription from "./RealtimeSubscription";

const OverviewTab = () => {
  const [hedgeRequests, setHedgeRequests] = useState<HedgeRequest[]>([]);
  const { toast } = useToast();

  const fetchHedgeRequests = async () => {
    try {
      console.log('🔄 Fetching hedge requests...');
      const { data, error } = await supabase
        .from('pre_trade_sfx_hedge_request')
        .select('*');

      if (error) {
        console.error('❌ Error fetching data:', error);
        throw error;
      }

      console.log('✅ Received hedge requests:', data);
      console.log('📊 Number of records:', data?.length || 0);

      const hedgeRequestsWithId = (data || []).map((request, index) => ({
        ...request,
        id: index + 1,
      }));

      console.log('🔄 Updating state with new data');
      setHedgeRequests(hedgeRequestsWithId);
      console.log('✅ State updated successfully');
    } catch (error) {
      console.error('❌ Error in fetchHedgeRequests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hedge request data",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <RealtimeSubscription onDataChange={fetchHedgeRequests} />
      <HedgeRequestsGrid hedgeRequests={hedgeRequests} />
    </>
  );
};

export default OverviewTab;