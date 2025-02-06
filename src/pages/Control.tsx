
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import TradeRequestsGrid from "@/components/control/TradeRequestsGrid";

const Control = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <TabsContainer tabs={tabsConfig["control"]} />
      <TradeRequestsGrid />
    </div>
  );
};

export default Control;
