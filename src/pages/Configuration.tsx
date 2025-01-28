import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Configuration = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["configuration"]} />
    </Layout>
  );
};

export default Configuration;