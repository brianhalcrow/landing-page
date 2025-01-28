import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Review = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Review</h1>
        <TabsContainer tabs={tabsConfig["review"]} />
      </div>
    </Layout>
  );
};

export default Review;