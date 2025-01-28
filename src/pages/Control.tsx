import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Control = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["control"]} />
    </Layout>
  );
};

export default Control;