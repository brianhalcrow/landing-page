
import React from "react";
import PendingTab from "@/components/monitor/PendingTab";
import CompletedTab from "@/components/monitor/CompletedTab";
import RejectedTab from "@/components/monitor/RejectedTab";
import HistoryTab from "@/components/monitor/HistoryTab";
import FxRatesTab from "@/rates/FxRates";
import SpotRatesStreaming from "@/rates/SpotRatesStreaming";
import OverviewTab from "@/components/review/OverviewTab";
import PositionsTab from "@/components/review/PositionsTab";
import ReviewTab from "@/components/review/ReviewTab";
import ApproveTab from "@/components/review/ApproveTab";
import ReadyToTradeTab from "@/components/review/ReadyToTradeTab";
import RejectedTradesTab from "@/components/review/RejectedTab";
import ForecastAdHocTab from "@/components/forecast/AdHocTab";
import HedgeRequestAdHocTab from "@/components/hedge-request/AdHocTab";
import CashflowHedgeForm from "@/components/hedge-request/cashflow/CashflowHedgeForm";
import DocumentsTab from "@/components/data-sources/DocumentsTab";
import ConnectionsTab from "@/components/data-sources/ConnectionsTab";
import ChatFXTab from "@/components/data-sources/ChatFXTab";
import LLMLoggingTab from "@/components/data-sources/LLMLoggingTab";
import GLTransactionsTab from "@/components/exposure/GLTransactionsTab";
import ExecutedTradesTab from "@/components/confirmation/ExecutedTradesTab";
import AnalyticsTab from "@/components/analytics/AnalyticsTab";
import CashManagementOverviewTab from "@/components/cash-management/OverviewTab";
import TradingGrid from "@/components/trading/TradingGrid";
import CalendarTab from "@/components/monitor/CalendarTab";
import { TrialBalanceGrid } from "@/components/exposure/balance-sheet/TrialBalanceGrid";
import FxTradingContainer from "@/components/trading/fx/FxTradingContainer";

export const tabsConfig = {
  "monitor": ({ baseCurrency, setBaseCurrency }) => [
    { value: "completed", label: "Completed", content: <CompletedTab /> },
    { value: "history", label: "History", content: <HistoryTab /> },
    { value: "pending", label: "Pending", content: <PendingTab /> },
    { value: "rejected", label: "Rejected", content: <RejectedTab /> },
    { value: "gain-loss", label: "Gain/Loss", content: <div>Gain/Loss Content Goes Here</div> },
    { value: "fx-rates", label: "FX Rates", content: <FxRatesTab baseCurrency={baseCurrency} setBaseCurrency={setBaseCurrency} /> },
    { value: "spot-rates", label: "Spot Rates", content: <SpotRatesStreaming baseCurrency={baseCurrency} /> },
    { value: "calendar", label: "Calendar", content: <CalendarTab /> },
  ],
  "hedge-request": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <HedgeRequestAdHocTab /> },
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Hedge Request</div> },
    { value: "cashflow", label: "Cashflow", content: <CashflowHedgeForm /> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Hedge Requests</div> },
  ],
  "cash-management": [
    { value: "overview", label: "Overview", content: <CashManagementOverviewTab /> },
  ],
  "settlement": [
    { value: "completed", label: "Completed", content: <div>Completed Settlements</div> },
    { value: "failed", label: "Failed", content: <div>Failed Settlements</div> },
    { value: "pending", label: "Pending", content: <div>Pending Settlements</div> },
  ],
  "data-sources": [
    { value: "connections", label: "Connections", content: <ConnectionsTab /> },
    { value: "chatfx", label: "ChatFX", content: <ChatFXTab /> },
    { value: "documents", label: "Documents", content: <DocumentsTab /> },
    { value: "llm-logging", label: "LLM Logging", content: <LLMLoggingTab /> },
    { value: "analytics", label: "Analytics", content: <AnalyticsTab /> }
  ],
  "configuration": [
    { value: "summary", label: "Summary", content: <div>Configuration Summary</div> },
    { value: "general", label: "General", content: <div>General Configuration</div> },
    { value: "entities", label: "Entities", content: <div>Entities Configuration</div> },
    { value: "process", label: "Process", content: <div>Process Configuration</div> }
  ],
  "exposure": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <div>Ad-Hoc Exposure</div> },
    { value: "balance-sheet", label: "Balance Sheet", content: <TrialBalanceGrid /> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Exposure</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Exposure</div> },
    { value: "gl-transactions", label: "GL Transactions", content: <GLTransactionsTab /> }
  ],
  "forecast": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <ForecastAdHocTab /> },
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Forecast</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Forecast</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Forecast</div> },
  ],
  "review": [
    { value: "overview", label: "Overview", content: <OverviewTab /> },
    { value: "review", label: "Review", content: <ReviewTab /> },
    { value: "approve", label: "Approve", content: <ApproveTab /> },
    { value: "ready", label: "Ready to Trade", content: <ReadyToTradeTab /> },
    { value: "rejected", label: "Rejected", content: <RejectedTradesTab /> },
  ],
  "control": [
    { value: "general", label: "General", content: <TradingGrid /> },
  ],
  "execution": [
    { value: "fx-trading", label: "FX Trading", content: <FxTradingContainer /> },
    { value: "multi-trade", label: "Multi-Trade", content: <div className="p-4"><h2 className="text-2xl font-semibold mb-4">Multi-Trade</h2><p>Multi-trade functionality coming soon.</p></div> }
  ],
  "confirmation": [
    { value: "executed", label: "Executed", content: <ExecutedTradesTab /> },
  ],
  "hedge-accounting": [
    { value: "general", label: "General", content: <div>Hedge Accounting Overview</div> },
  ],
  "settings": [
    { value: "general", label: "General", content: <div>Settings Overview</div> },
  ],
};
