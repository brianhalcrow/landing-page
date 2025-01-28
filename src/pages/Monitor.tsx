import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Monitor = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["monitor"]} />
    </Layout>
  );
};

export default Monitor;