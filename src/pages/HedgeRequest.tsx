import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["hedge-request"]} />
    </Layout>
  );
};

export default HedgeRequest;