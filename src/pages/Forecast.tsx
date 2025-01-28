import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Forecast = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Forecast</h1>
        <TabsContainer tabs={tabsConfig["forecast"]} />
      </div>
    </Layout>
  );
};

export default Forecast;