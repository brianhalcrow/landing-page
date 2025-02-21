
import React from "react";
import TabsContainer from "@/components/TabsContainer.tsx";
import { tabsConfig } from "@/config/tabsConfig.tsx";

const Execution = () => {
  return (
    <div className="container mx-auto p-6">
      <TabsContainer tabs={tabsConfig.execution} defaultValue="fx-trading" />
    </div>
  );
};

export default Execution;
