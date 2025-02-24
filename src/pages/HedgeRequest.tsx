
import { useEffect } from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const HedgeRequest = () => {
  // Ensure clean component mount/unmount
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  return (
    <div className="w-full h-full">
      <TabsContainer tabs={tabsConfig["hedge-request"]} />
    </div>
  );
};

export default HedgeRequest;
