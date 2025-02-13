import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = () => {
  return <TabsContainer tabs={tabsConfig["hedge-request"]} />;
};

export default HedgeRequest;