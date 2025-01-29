import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Confirmation = () => {
  return <TabsContainer tabs={tabsConfig["confirmation"]} />;
};

export default Confirmation;