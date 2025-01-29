import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Review = () => {
  return <TabsContainer tabs={tabsConfig["review"]} />;
};

export default Review;