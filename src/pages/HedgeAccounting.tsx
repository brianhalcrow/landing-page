import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeAccounting = () => {
  return <TabsContainer tabs={tabsConfig["hedge-accounting"]} />;
};

export default HedgeAccounting;