import React, { useState } from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Monitor = () => {
  const [baseCurrency, setBaseCurrency] = useState("GBP"); // Shared state for FX rates

  return <TabsContainer tabs={tabsConfig["monitor"]({ baseCurrency, setBaseCurrency })} />;
};

export default Monitor;
