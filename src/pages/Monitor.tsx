import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Monitor = () => {
  return (
    <Layout>
      <div className="p-6">
        <TabsContainer tabs={tabsConfig["monitor"]} />
      </div>
    </Layout>
  );
};

export default Monitor;