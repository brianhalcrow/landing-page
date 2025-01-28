import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const DataSources = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["data-sources"]} />
    </Layout>
  );
};

export default DataSources;