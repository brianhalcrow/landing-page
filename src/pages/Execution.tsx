
import React from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import FxTradingContainer from "@/components/trading/fx/FxTradingContainer";

const Execution = () => {
  return <TabsContainer tabs={tabsConfig.execution} defaultTab="fx-trading" />;
};

export default Execution;
