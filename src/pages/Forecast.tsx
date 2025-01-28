import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Forecast = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["forecast"]} />
    </Layout>
  );
};

export default Forecast;