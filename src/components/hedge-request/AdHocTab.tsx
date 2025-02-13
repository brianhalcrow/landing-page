
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import InputDraftGrid from "./grid/InputDraftGrid";
import NewHedgeRequestGrid from "./new-grid/NewHedgeRequestGrid";
import { useState } from "react";
import { HedgeRequest } from "./new-grid/types/hedgeRequest.types";

const AdHocTab = () => {
  const [newGridData, setNewGridData] = useState<HedgeRequest[]>([{
    entity_id: "",
    entity_name: "",
    counterparty: "",
    counterparty_name: "", // Added missing field
    strategy: "",
    instrument: "",
    ccy_pair: "",
    trade_date: "",
    settlement_date: ""
  }]);

  const { data: hedgeRequests, isLoading } = useQuery({
    queryKey: ['hedge-request-drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select(`
          id,
          entity_id,
          entity_name,
          functional_currency,
          cost_centre,
          exposure_category_l1,
          exposure_category_l2,
          exposure_category_l3,
          strategy_description,
          instrument,
          status
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hedge request drafts:', error);
        throw error;
      }

      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">New Draft Request</h2>
        <div className="space-y-8">
          <InputDraftGrid />
          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4">New Implementation (In Progress)</h3>
            <NewHedgeRequestGrid 
              rowData={newGridData}
              onRowDataChange={setNewGridData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdHocTab;
