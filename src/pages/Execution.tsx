import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Execution = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["execution"]} />
    </Layout>
  );
};

export default Execution;