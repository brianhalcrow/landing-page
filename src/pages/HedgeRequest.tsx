
import { useCallback, useMemo } from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = () => {
  // Memoize the tabs configuration to prevent unnecessary re-renders
  const hedgeRequestTabs = useMemo(() => tabsConfig["hedge-request"], []);

  return (
    <div className="w-full h-full">
      <TabsContainer tabs={hedgeRequestTabs} />
    </div>
  );
};

export default HedgeRequest;
