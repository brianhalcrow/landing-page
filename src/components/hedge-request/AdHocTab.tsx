import { Skeleton } from "@/components/ui/skeleton";
import DraftDetailsGrid from "./grid/DraftDetailsGrid";

const AdHocTab = () => {
  // We'll implement data fetching later, for now just pass an empty array
  const hedgeRequests = [];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Draft Details</h2>
        <DraftDetailsGrid hedgeRequests={hedgeRequests} />
      </div>
    </div>
  );
};

export default AdHocTab;