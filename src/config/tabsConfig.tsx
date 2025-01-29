import React from "react";
import PendingTab from "@/components/monitor/PendingTab";
import CompletedTab from "@/components/monitor/CompletedTab";
import RejectedTab from "@/components/monitor/RejectedTab";
import HistoryTab from "@/components/monitor/HistoryTab";
import OverviewTab from "@/components/review/OverviewTab";
import PositionsTab from "@/components/review/PositionsTab";
import EntitiesTab from "@/components/configuration/EntitiesTab";

export const tabsConfig = {
  "monitor": [
    { value: "pending", label: "Pending", content: <PendingTab /> },
    { value: "completed", label: "Completed", content: <CompletedTab /> },
    { value: "rejected", label: "Rejected", content: <RejectedTab /> },
    { value: "history", label: "History", content: <HistoryTab /> },
  ],
  "settlement": [
    { value: "pending", label: "Pending", content: <div>Pending Settlements</div> },
    { value: "completed", label: "Completed", content: <div>Completed Settlements</div> },
    { value: "failed", label: "Failed", content: <div>Failed Settlements</div> },
  ],
  "data-sources": [
    { value: "connections", label: "Connections", content: <div>Data Source Connections</div> },
    { value: "history", label: "History", content: <div>Connection History</div> },
  ],
  "configuration": [
    { value: "entities", label: "Entities", content: <EntitiesTab /> },
    { value: "general", label: "General", content: <div>General Configuration</div> },
    { value: "integrations", label: "Integrations", content: <div>Integrations Configuration</div> },
  ],
  "exposure": [
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Exposure</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Exposure</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Exposure</div> },
    { value: "ad-hoc", label: "Ad-Hoc", content: <div>Ad-Hoc Exposure</div> },
  ],
  "forecast": [
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Forecast</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Forecast</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Forecast</div> },
    { value: "ad-hoc", label: "Ad-Hoc", content: <div>Ad-Hoc Forecast</div> },
  ],
  "hedge-request": [
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Hedge Requests</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Hedge Requests</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Hedge Requests</div> },
    { value: "ad-hoc", label: "Ad-Hoc", content: <div>Ad-Hoc Hedge Requests</div> },
  ],
  "review": [
    { value: "overview", label: "Overview", content: <OverviewTab /> },
    { value: "positions", label: "Positions", content: <PositionsTab /> },
    { value: "limits", label: "Limits", content: <div>Review Limits</div> },
    { value: "reports", label: "Reports", content: <div>Review Reports</div> },
  ],
  "control": [
    { value: "general", label: "General", content: <div>Control Overview</div> },
  ],
  "execution": [
    { value: "general", label: "General", content: <div>Execution Overview</div> },
  ],
  "confirmation": [
    { value: "general", label: "General", content: <div>Confirmation Overview</div> },
  ],
  "hedge-accounting": [
    { value: "general", label: "General", content: <div>Hedge Accounting Overview</div> },
  ],
  "settings": [
    { value: "general", label: "General", content: <div>Settings Overview</div> },
  ],
};