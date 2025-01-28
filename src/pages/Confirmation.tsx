import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Confirmation = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["confirmation"]} />
    </Layout>
  );
};

export default Confirmation;