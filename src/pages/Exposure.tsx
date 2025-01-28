import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Exposure = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["exposure"]} />
    </Layout>
  );
};

export default Exposure;