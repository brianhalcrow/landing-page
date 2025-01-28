import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeAccounting = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["hedge-accounting"]} />
    </Layout>
  );
};

export default HedgeAccounting;