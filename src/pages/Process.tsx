import { Suspense } from "react";
import ProcessGrid from "@/components/process/ProcessGrid";
import { Skeleton } from "@/components/ui/skeleton";

const Process = () => {
  return (
    <div className="p-6">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ProcessGrid />
      </Suspense>
    </div>
  );
};

export default Process;