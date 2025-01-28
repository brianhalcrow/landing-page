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

  useEffect(() => {
    const fetchHedgeRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('pre_trade_sfx_hedge_request')
          .select('*');

        if (error) {
          throw error;
        }

        // Add an id field for MUI DataGrid
        const hedgeRequestsWithId = (data || []).map((request, index) => ({
          ...request,
          id: index + 1, // MUI DataGrid requires a unique id field
        }));

        setHedgeRequests(hedgeRequestsWithId);
      } catch (error) {
        console.error('Error fetching hedge requests:', error);
        toast({
          title: "Error",
          description: "Failed to fetch hedge request data",
          variant: "destructive",
        });
      }
    };

    fetchHedgeRequests();
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