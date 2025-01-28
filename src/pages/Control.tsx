import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Control = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Control</h1>
        <TabsContainer tabs={tabsConfig["control"]} />
      </div>
    </Layout>
  );
};

export default Control;