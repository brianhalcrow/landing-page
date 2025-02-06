
import React from "react";
import PendingTab from "@/components/monitor/PendingTab";
import CompletedTab from "@/components/monitor/CompletedTab";
import RejectedTab from "@/components/monitor/RejectedTab";
import HistoryTab from "@/components/monitor/HistoryTab";
import OverviewTab from "@/components/review/OverviewTab";
import PositionsTab from "@/components/review/PositionsTab";
import EntityConfigurationTab from "@/components/configuration/EntityConfigurationTab";
import EntitiesTab from "@/components/configuration/EntitiesTab";
import ProcessGrid from "@/components/process/ProcessGrid";
import ForecastAdHocTab from "@/components/forecast/AdHocTab";
import HedgeRequestAdHocTab from "@/components/hedge-request/AdHocTab";
import SummaryTab from "@/components/configuration/SummaryTab";
import DocumentsTab from "@/components/data-sources/DocumentsTab";
import ConnectionsTab from "@/components/data-sources/ConnectionsTab";

export const tabsConfig = {
  "monitor": [
    { value: "completed", label: "Completed", content: <CompletedTab /> },
    { value: "history", label: "History", content: <HistoryTab /> },
    { value: "pending", label: "Pending", content: <PendingTab /> },
    { value: "rejected", label: "Rejected", content: <RejectedTab /> },
  ],
  "settlement": [
    { value: "completed", label: "Completed", content: <div>Completed Settlements</div> },
    { value: "failed", label: "Failed", content: <div>Failed Settlements</div> },
    { value: "pending", label: "Pending", content: <div>Pending Settlements</div> },
  ],
  "data-sources": [
    { value: "connections", label: "Connections", content: <ConnectionsTab /> },
    { value: "history", label: "History", content: <HistoryTab /> },
    { value: "documents", label: "Documents", content: <DocumentsTab /> },
  ],
  "configuration": [
    { value: "summary", label: "Summary", content: <SummaryTab /> },
    { value: "general", label: "Entity Configuration", content: <EntityConfigurationTab /> },
    { value: "entities", label: "Entities", content: <EntitiesTab /> },
    { value: "process", label: "Process", content: <ProcessGrid /> },
  ],
  "exposure": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <div>Ad-Hoc Exposure</div> },
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Exposure</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Exposure</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Exposure</div> },
  ],
  "forecast": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <ForecastAdHocTab /> },
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Forecast</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Forecast</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Forecast</div> },
  ],
  "hedge-request": [
    { value: "ad-hoc", label: "Ad-Hoc", content: <HedgeRequestAdHocTab /> },
    { value: "balance-sheet", label: "Balance Sheet", content: <div>Balance Sheet Hedge Request</div> },
    { value: "cashflow", label: "Cashflow", content: <div>Cashflow Hedge Requests</div> },
    { value: "intramonth", label: "Intramonth", content: <div>Intramonth Hedge Requests</div> },
  ],
  "review": [
    { value: "overview", label: "Overview", content: <OverviewTab /> },
    { value: "positions", label: "Positions", content: <PositionsTab /> },
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
