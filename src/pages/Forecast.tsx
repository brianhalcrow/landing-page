import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Forecast = () => {
  return <TabsContainer tabs={tabsConfig["forecast"]} />;
};

export default Forecast;