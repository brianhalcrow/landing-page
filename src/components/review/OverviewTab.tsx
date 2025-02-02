import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import RealtimeSubscription from "./RealtimeSubscription";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeRequestOverview {
  id: number;
  entity_id: string | null;
  entity_name: string | null;
  cost_centre: string | null;
  functional_currency: string | null;
  exposure_category_l1: string | null;
  exposure_category_l2: string | null;
  exposure_category_l3: string | null;
  strategy_description: string | null;
  instrument: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Trade related fields
  trade_id: number | null;
  draft_id: string | null;
  buy_currency: string | null;
  sell_currency: string | null;
  buy_amount: number | null;
  sell_amount: number | null;
  trade_date: string | null;
  settlement_date: string | null;
  trade_created_at: string | null;
  trade_updated_at: string | null;
  trade_entity_id: string | null;
  trade_entity_name: string | null;
}

export const OverviewTab = () => {
  const [rowData, setRowData] = useState<HedgeRequestOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const columnDefs: ColDef<HedgeRequestOverview>[] = [
    { 
      field: 'id', 
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'cost_centre', 
      headerName: 'Cost Centre',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'functional_currency', 
      headerName: 'Currency',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l1', 
      headerName: 'Category L1',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l2', 
      headerName: 'Category L2',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l3', 
      headerName: 'Category L3',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'strategy_description', 
      headerName: 'Strategy',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'created_by', 
      headerName: 'Created By',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'created_at', 
      headerName: 'Created',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    // Trade related columns
    { 
      field: 'trade_id', 
      headerName: 'Trade ID',
      flex: 0.5,
      minWidth: 80,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'buy_currency', 
      headerName: 'Buy Currency',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'sell_currency', 
      headerName: 'Sell Currency',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'buy_amount', 
      headerName: 'Buy Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString() : '';
      }
    },
    { 
      field: 'sell_amount', 
      headerName: 'Sell Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString() : '';
      }
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    }
  ];

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests...");
      setIsLoading(true);

      const { data, error } = await supabase
        .from("hedge_request_draft")
        .select(`
          *,
          hedge_request_draft_trades (
            id,
            draft_id,
            buy_currency,
            sell_currency,
            buy_amount,
            sell_amount,
            trade_date,
            settlement_date,
            created_at,
            updated_at,
            entity_id,
            entity_name
          )
        `)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("❌ Error fetching data:", error);
        throw error;
      }

      if (!data) {
        console.log("No data returned");
        setRowData([]);
        return;
      }

      // Transform the data to flatten the trades
      const transformedData: HedgeRequestOverview[] = data.flatMap(draft => {
        if (!draft.hedge_request_draft_trades || draft.hedge_request_draft_trades.length === 0) {
          // Return the draft without trade data
          return [{
            ...draft,
            trade_id: null,
            draft_id: null,
            buy_currency: null,
            sell_currency: null,
            buy_amount: null,
            sell_amount: null,
            trade_date: null,
            settlement_date: null,
            trade_created_at: null,
            trade_updated_at: null,
            trade_entity_id: null,
            trade_entity_name: null
          }];
        }
        
        // Return a row for each trade
        return draft.hedge_request_draft_trades.map(trade => ({
          ...draft,
          trade_id: trade.id,
          draft_id: trade.draft_id,
          buy_currency: trade.buy_currency,
          sell_currency: trade.sell_currency,
          buy_amount: trade.buy_amount,
          sell_amount: trade.sell_amount,
          trade_date: trade.trade_date,
          settlement_date: trade.settlement_date,
          trade_created_at: trade.created_at,
          trade_updated_at: trade.updated_at,
          trade_entity_id: trade.entity_id,
          trade_entity_name: trade.entity_name
        }));
      });

      console.log("✅ Fetched hedge requests:", transformedData);
      setRowData(transformedData);
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
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 OverviewTab unmounted");
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
        <div className="ag-theme-alpine h-[600px] w-full">
          <GridStyles />
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: false
            }}
            animateRows={true}
            suppressColumnVirtualisation={true}
            enableCellTextSelection={true}
          />
        </div>
      )}
    </div>
  );
};

export default OverviewTab;