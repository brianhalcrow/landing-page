import Layout from "@/components/Layout";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Review = () => {
  return (
    <Layout>
      <TabsContainer tabs={tabsConfig["review"]} />
    </Layout>
  );
};

export default Review;