import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Settlement = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig.settlement} />
    </Layout>
  );
};

export default Settlement;