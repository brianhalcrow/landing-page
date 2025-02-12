
export interface CashManagementData {
  entity_id: string;
  entity_name: string;
  transaction_currency: string;
  month: string;
  category: string;
  "Transaction Amount": number;
  forecast_amount: number | null;
  source: string;
}
