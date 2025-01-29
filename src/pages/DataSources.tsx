import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const DataSources = () => {
  return <TabsContainer tabs={tabsConfig["data-sources"]} />;
};

export default DataSources;