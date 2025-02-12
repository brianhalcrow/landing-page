
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Configuration = () => {
  return (
    <TabsContainer 
      tabs={tabsConfig["configuration"]} 
    />
  );
};

export default Configuration;
