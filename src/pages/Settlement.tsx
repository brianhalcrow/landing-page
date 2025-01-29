import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Settlement = () => {
  return <TabsContainer tabs={tabsConfig["settlement"]} />;
};

export default Settlement;