import { Suspense } from "react";
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { Skeleton } from "@/components/ui/skeleton";

const Configuration = () => {
  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <TabsContainer tabs={tabsConfig["configuration"]} />
    </Suspense>
  );
};

export default Configuration;