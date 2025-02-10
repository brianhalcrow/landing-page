
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import TradeControlGrid from "@/components/control/TradeControlGrid";

const Control = () => {
  return (
    <div className="container-fluid px-6 py-6 space-y-6">
      <TabsContainer tabs={tabsConfig["control"]} />
      <TradeControlGrid />
    </div>
  );
};

export default Control;
