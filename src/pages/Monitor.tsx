import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Monitor = () => {
  return <TabsContainer tabs={tabsConfig["monitor"]} />;
};

export default Monitor;