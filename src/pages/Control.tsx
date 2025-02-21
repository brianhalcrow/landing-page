
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Control = () => {
  return <TabsContainer tabs={tabsConfig["control"]} />;
};

export default Control;
