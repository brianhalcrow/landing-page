
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Execution = () => {
  return (
    <div>
      <TabsContainer tabs={tabsConfig["execution"]} />
      <FxTradingContainer />
    </div>
  );
};

export default Execution;
