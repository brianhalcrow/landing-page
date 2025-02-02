import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HedgeRequestDraft, HedgeRequestDraftTrade, HedgeRequestOverview } from "../types/hedge-request.types";

export const useHedgeRequests = (isMounted: boolean) => {
  const [rowData, setRowData] = useState<HedgeRequestOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests...");
      setIsLoading(true);

      const [draftsResponse, tradesResponse] = await Promise.all([
        supabase
          .from("hedge_request_draft")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("hedge_request_draft_trades")
          .select("*")
      ]);

      if (!isMounted) return;

      if (draftsResponse.error) {
        console.error("❌ Error fetching drafts:", draftsResponse.error);
        throw draftsResponse.error;
      }

      if (tradesResponse.error) {
        console.error("❌ Error fetching trades:", tradesResponse.error);
        throw tradesResponse.error;
      }

      const drafts = draftsResponse.data || [];
      const trades = tradesResponse.data || [];

      const tradesByDraftId = new Map<string, HedgeRequestDraftTrade[]>();
      trades.forEach(trade => {
        if (trade.draft_id) {
          const draftTrades = tradesByDraftId.get(trade.draft_id) || [];
          draftTrades.push(trade);
          tradesByDraftId.set(trade.draft_id, draftTrades);
        }
      });

      const transformedData: HedgeRequestOverview[] = drafts.flatMap(draft => {
        const draftId = draft.id.toString();
        const draftTrades = tradesByDraftId.get(draftId) || [];

        if (draftTrades.length === 0) {
          return [{
            ...draft,
            trade_id: null,
            draft_id: draftId,
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
        
        return draftTrades.map(trade => ({
          ...draft,
          trade_id: trade.id,
          draft_id: draftId,
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

  return { rowData, isLoading, fetchHedgeRequests };
};