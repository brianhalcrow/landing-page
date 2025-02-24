
import { memo } from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = memo(() => {
  return (
    <div className="w-full h-full">
      <TabsContainer tabs={tabsConfig["hedge-request"]} />
    </div>
  );
});

HedgeRequest.displayName = "HedgeRequest";

export default HedgeRequest;
