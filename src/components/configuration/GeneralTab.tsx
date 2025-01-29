import { Suspense } from "react";
import ConfigurationForm from "./form/ConfigurationForm";
import { Skeleton } from "@/components/ui/skeleton";

const GeneralTab = () => {
  return (
    <div className="p-6">
      <ConfigurationForm />
    </div>
  );
};

export default GeneralTab;