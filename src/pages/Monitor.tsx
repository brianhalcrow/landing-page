import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Monitor = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Monitor</h1>
        <TabsContainer tabs={tabsConfig["monitor"]} />
      </div>
    </Layout>
  );
};

export default Monitor;