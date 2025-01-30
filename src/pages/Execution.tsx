import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Execution = () => {
  return <TabsContainer tabs={tabsConfig["execution"]} />;
};

export default Execution;