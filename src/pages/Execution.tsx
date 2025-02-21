
import React from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import FxTradingContainer from "@/components/trading/fx/FxTradingContainer";

const Execution = () => {
  return (
    <div className="container mx-auto p-6">
      <TabsContainer tabs={tabsConfig.execution} defaultValue="fx-trading" />
    </div>
  );
};

export default Execution;
