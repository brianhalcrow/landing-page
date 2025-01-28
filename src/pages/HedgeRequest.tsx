import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Hedge Request</h1>
        <TabsContainer tabs={tabsConfig["hedge-request"]} />
      </div>
    </Layout>
  );
};

export default HedgeRequest;