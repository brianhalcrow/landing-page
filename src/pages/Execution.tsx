
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import FxTradingContainer from "@/components/trading/fx/FxTradingContainer";

const Execution = () => {
  return (
    <div>
      <TabsContainer tabs={tabsConfig["execution"]} />
      <FxTradingContainer />
    </div>
  );
};

export default Execution;
