import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Settlement = () => {
  return (
    <Layout>
      <div className="p-6">
        <TabsContainer tabs={tabsConfig.settlement} />
      </div>
    </Layout>
  );
};

export default Settlement;