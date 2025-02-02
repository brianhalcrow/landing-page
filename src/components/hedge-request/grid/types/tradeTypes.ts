export interface HedgeRequestDraftTrade {
  id?: number;
  draft_id?: string;
  base_currency?: string;
  quote_currency?: string;
  currency_pair?: string;
  trade_date?: string;
  settlement_date?: string;
  buy_sell?: string;
  buy_sell_currency_code?: string;
  buy_sell_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TradeGridProps {
  rowData: HedgeRequestDraftTrade[];
  onRowDataChange: (newData: HedgeRequestDraftTrade[]) => void;
}