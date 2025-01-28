import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HedgeRequest {
  entity_id: string | null;
  entity_name: string | null;
  instrument: string | null;
  strategy: string | null;
  base_currency: string | null;
  quote_currency: string | null;
  currency_pair: string | null;
  trade_date: string | null;
  settlement_date: string | null;
  buy_sell: string | null;
  buy_sell_currency_code: string | null;
  buy_sell_amount: number | null;
  created_by: string | null;
  trade_request_id: string | null;
}

const OverviewTab = () => {
  const [hedgeRequests, setHedgeRequests] = useState<HedgeRequest[]>([]);
  const { toast } = useToast();

  const columns: GridColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 130 },
    { field: 'entity_name', headerName: 'Entity Name', width: 150 },
    { field: 'instrument', headerName: 'Instrument', width: 130 },
    { field: 'strategy', headerName: 'Strategy', width: 130 },
    { field: 'base_currency', headerName: 'Base Currency', width: 130 },
    { field: 'quote_currency', headerName: 'Quote Currency', width: 130 },
    { field: 'currency_pair', headerName: 'Currency Pair', width: 130 },
    { field: 'trade_date', headerName: 'Trade Date', width: 130 },
    { field: 'settlement_date', headerName: 'Settlement Date', width: 150 },
    { field: 'buy_sell', headerName: 'Buy/Sell', width: 100 },
    { field: 'buy_sell_currency_code', headerName: 'Buy/Sell Currency', width: 150 },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Buy/Sell Amount', 
      width: 150,
      type: 'number',
    },
    { field: 'created_by', headerName: 'Created By', width: 150 },
    { field: 'trade_request_id', headerName: 'Trade Request ID', width: 150 },
  ];

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

      // Add an id field for MUI DataGrid
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

  useEffect(() => {
    console.log('🚀 Component mounted, initializing...');
    
    // Initial fetch
    console.log('📡 Performing initial data fetch...');
    fetchHedgeRequests();

    // Set up realtime subscription with reconnection handling
    console.log('🔌 Setting up realtime subscription...');
    const channel = supabase
      .channel('hedge-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pre_trade_sfx_hedge_request'
        },
        (payload) => {
          console.log('📨 Received realtime update:', payload);
          console.log('🔄 Type of change:', payload.eventType);
          console.log('📝 Changed record:', payload.new);
          fetchHedgeRequests();
        }
      )
      .subscribe(async (status) => {
        console.log('📡 Subscription status changed to:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime updates');
          toast({
            title: "Connected",
            description: "Real-time updates are now active",
          });
        }
        
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.log('⚠️ Subscription closed or errored, attempting to reconnect...');
          
          // Wait a bit before attempting to reconnect
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            console.log('🔄 Attempting to reconnect...');
            await channel.subscribe();
            console.log('✅ Successfully reconnected');
            toast({
              title: "Reconnected",
              description: "Real-time connection restored",
            });
          } catch (error) {
            console.error('❌ Failed to reconnect:', error);
            toast({
              title: "Connection Error",
              description: "Lost connection to real-time updates. Please refresh the page.",
              variant: "destructive",
            });
          }
        }
      });

    // Cleanup subscription on component unmount
    return () => {
      console.log('🧹 Cleaning up subscription...');
      supabase.removeChannel(channel);
      console.log('✅ Cleanup completed');
    };
  }, [toast]);

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={hedgeRequests}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default OverviewTab;