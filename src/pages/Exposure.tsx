import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Exposure = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Exposure</h1>
        <TabsContainer tabs={tabsConfig["exposure"]} />
      </div>
    </Layout>
  );
};

export default Exposure;