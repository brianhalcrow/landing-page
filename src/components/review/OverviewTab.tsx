import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HedgeRequest } from "./types";
import HedgeRequestsGrid from "./HedgeRequestsGrid";
import RealtimeSubscription from "./RealtimeSubscription";

export const OverviewTab = () => {
  const [hedgeRequests, setHedgeRequests] = useState<HedgeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track mount status to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(true);

<<<<<<< HEAD
  const columns: GridColDef[] = [
    { field: "entity_id", headerName: "Entity ID", width: 130 },
    { field: "entity_name", headerName: "Entity Name", width: 150 },
    { field: "instrument", headerName: "Instrument", width: 130 },
    { field: "strategy", headerName: "Strategy", width: 130 },
    { field: "base_currency", headerName: "Base Currency", width: 130 },
    { field: "quote_currency", headerName: "Quote Currency", width: 130 },
    { field: "currency_pair", headerName: "Currency Pair", width: 130 },
    { field: "trade_date", headerName: "Trade Date", width: 130 },
    { field: "settlement_date", headerName: "Settlement Date", width: 150 },
    { field: "buy_sell", headerName: "Buy/Sell", width: 100 },
    {
      field: "buy_sell_currency_code",
      headerName: "Buy/Sell Currency",
      width: 150,
    },
    {
      field: "buy_sell_amount",
      headerName: "Buy/Sell Amount",
      width: 150,
      type: "number",
    },
    { field: "created_by", headerName: "Created By", width: 150 },
    { field: "trade_request_id", headerName: "Trade Request ID", width: 150 },
  ];
=======
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests...");
<<<<<<< HEAD
      const { data, error } = await supabase
        .from("pre_trade_sfx_hedge_request")
        .select("*");
=======
      setIsLoading(true);

      const { data, error } = await supabase
        .from("pre_trade_sfx_hedge_request")
        .select("*")
        .order("trade_request_id", { ascending: false });

      if (!isMounted) return;
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99

      if (error) {
        console.error("❌ Error fetching data:", error);
        throw error;
      }

<<<<<<< HEAD
      console.log("✅ Received hedge requests:", data);
      console.log("📊 Number of records:", data?.length || 0);

      // Add an id field for MUI DataGrid
      const hedgeRequestsWithId = (data || []).map((request, index) => ({
=======
      const hedgeRequestsWithId = (data || []).map((request) => ({
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99
        ...request,
        id: `hr-${Date.now()}-${Math.random()}`,
      }));

<<<<<<< HEAD
      console.log("🔄 Updating state with new data");
      setHedgeRequests(hedgeRequestsWithId);
      console.log("✅ State updated successfully");
    } catch (error) {
      console.error("❌ Error in fetchHedgeRequests:", error);
      toast({
        title: "Error",
        description: `Failed to fetch hedge request data: ${error.message}`,
        variant: "destructive",
      });
=======
      console.log("✅ Fetched hedge requests:", hedgeRequestsWithId);
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
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99
    }
  }, [isMounted]);

  // Debug log for state updates
  useEffect(() => {
<<<<<<< HEAD
    console.log("🚀 Component mounted, initializing...");

    // Initial fetch
    console.log("📡 Performing initial data fetch...");
    fetchHedgeRequests();

    // Set up realtime subscription
    console.log("🔌 Setting up realtime subscription...");
    const channel = supabase
      .channel("hedge-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pre_trade_sfx_hedge_request",
        },
        (payload) => {
          console.log("📨 Received database change:", payload);
          console.log("Event type:", payload.eventType);
          console.log("Table:", payload.table);
          console.log("Schema:", payload.schema);
          console.log("Payload:", JSON.stringify(payload, null, 2));

          toast({
            title: `${payload.eventType} Event`,
            description: `Hedge request ${payload.eventType.toLowerCase()}`,
          });
          fetchHedgeRequests();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime updates");
          toast({
            title: "Connected",
            description: "Real-time updates are now active",
          });
        }

        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.log("⚠️ Subscription closed or errored:", status);
          toast({
            title: "Connection Lost",
            description: `Lost connection to real-time updates: ${status}`,
            variant: "destructive",
          });
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🧹 Cleaning up subscription...");
      supabase.removeChannel(channel);
=======
    console.log("💾 Hedge requests state updated:", hedgeRequests);
  }, [hedgeRequests]);

  // Initial data fetch
  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 OverviewTab unmounted");
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99
    };
  }, [fetchHedgeRequests]);

  return (
<<<<<<< HEAD
    <div className="h-[600px] w-full">
      <DataGrid
        rows={hedgeRequests}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: "entity_id", sort: "asc" }],
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        filterModel={{
          items: [
            {
              columnField: "entity_name",
              operatorValue: "contains",
              value: "",
            },
          ],
        }}
      />
=======
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={fetchHedgeRequests} />
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <span>Loading hedge requests...</span>
        </div>
      ) : (
        <HedgeRequestsGrid 
          hedgeRequests={hedgeRequests}
        />
      )}
>>>>>>> 92bd70ed37269681defbbb0865a03be190038d99
    </div>
  );
};

export default OverviewTab;
