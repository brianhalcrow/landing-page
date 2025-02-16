
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Execution = () => {
  return (
    <div>
      <TabsContainer tabs={tabsConfig["execution"]} />
    </div>
  );
};

export default Execution;
