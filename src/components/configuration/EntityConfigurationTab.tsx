
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProcessConfigurationGrid from "./grid/ProcessConfigurationGrid";
import { useProcessData } from "../process/hooks/useProcessData";

const EntityConfigurationTab = () => {
  const { processTypes, entitySettings, isLoading } = useProcessData();

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <div className="p-6">
        <ProcessConfigurationGrid 
          entities={entitySettings || []}
          processTypes={processTypes || []}
        />
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;
