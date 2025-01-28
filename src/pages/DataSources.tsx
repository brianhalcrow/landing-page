import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const DataSources = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Data Sources</h1>
        <TabsContainer tabs={tabsConfig["data-sources"]} />
      </div>
    </Layout>
  );
};

export default DataSources;