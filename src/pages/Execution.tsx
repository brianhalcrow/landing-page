import React from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import FxTradingContainer from "@/components/trading/fx/FxTradingContainer";
const Execution = () => {
  return <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-4">
      
      <TabsContainer tabs={tabsConfig.execution} defaultTab="fx-trading" />
    </div>;
};
export default Execution;