
import { memo } from "react";
import HedgeRequestGrid from "./new-grid/HedgeRequestGrid";

const AdHocTab = () => {
  return (
    <div className="p-6">
      <HedgeRequestGrid />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AdHocTab);
