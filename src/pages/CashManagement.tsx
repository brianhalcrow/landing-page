
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const CashManagement = () => {
  return <TabsContainer tabs={tabsConfig["cash-management"]} />;
};

export default CashManagement;
