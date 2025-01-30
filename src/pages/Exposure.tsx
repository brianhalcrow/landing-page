import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Exposure = () => {
  return <TabsContainer tabs={tabsConfig["exposure"]} />;
};

export default Exposure;