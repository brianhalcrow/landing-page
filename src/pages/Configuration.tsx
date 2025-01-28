import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Configuration = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Configuration</h1>
        <TabsContainer tabs={tabsConfig["configuration"]} />
      </div>
    </Layout>
  );
};

export default Configuration;