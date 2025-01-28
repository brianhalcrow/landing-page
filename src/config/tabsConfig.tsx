import React from "react";
import PendingTab from "@/components/monitor/PendingTab";
import CompletedTab from "@/components/monitor/CompletedTab";
import RejectedTab from "@/components/monitor/RejectedTab";
import HistoryTab from "@/components/monitor/HistoryTab";

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
};