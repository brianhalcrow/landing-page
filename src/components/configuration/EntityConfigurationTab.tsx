import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EntityConfigurationTab = () => {
  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Entity Configuration</h2>
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;