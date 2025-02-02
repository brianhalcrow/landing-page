import { useState, useEffect } from "react";
import RealtimeSubscription from "./RealtimeSubscription";
import { useHedgeRequests } from "./hooks/useHedgeRequests";
import { HedgeRequestsGrid } from "./components/HedgeRequestsGrid";

export const OverviewTab = () => {
  const [isMounted, setIsMounted] = useState(true);
  const { rowData, isLoading, fetchHedgeRequests } = useHedgeRequests(isMounted);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 OverviewTab unmounted");
    };
  }, [fetchHedgeRequests]);

  return (
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={fetchHedgeRequests} />
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <span>Loading hedge requests...</span>
        </div>
      ) : (
        <HedgeRequestsGrid rowData={rowData} />
      )}
    </div>
  );
};

export default OverviewTab;