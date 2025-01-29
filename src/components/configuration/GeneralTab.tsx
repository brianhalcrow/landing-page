import { Suspense } from "react";
import ConfigurationForm from "./form/ConfigurationForm";
import { Skeleton } from "@/components/ui/skeleton";

const GeneralTab = () => {
  return (
    <div className="p-6">
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ConfigurationForm />
      </Suspense>
    </div>
  );
};

export default GeneralTab;