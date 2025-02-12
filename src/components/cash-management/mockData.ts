
import { CashManagementData } from './types';

export const mockData: CashManagementData[] = [
  {
    entity_id: "1",
    entity_name: "Entity A",
    transaction_currency: "USD",
    month: "2024-01-01",
    category: "Revenue",
    "Transaction Amount": 10000,
    forecast_amount: null,
    source: "Actual"
  },
  {
    entity_id: "1",
    entity_name: "Entity A",
    transaction_currency: "USD",
    month: "2024-01-01",
    category: "Revenue",
    "Transaction Amount": 0,
    forecast_amount: 12000,
    source: "Forecast"
  },
  {
    entity_id: "2",
    entity_name: "Entity B",
    transaction_currency: "EUR",
    month: "2024-01-01",
    category: "Expenses",
    "Transaction Amount": 5000,
    forecast_amount: null,
    source: "Actual"
  },
  {
    entity_id: "2",
    entity_name: "Entity B",
    transaction_currency: "EUR",
    month: "2024-01-01",
    category: "Expenses",
    "Transaction Amount": 0,
    forecast_amount: 5500,
    source: "Forecast"
  }
];
