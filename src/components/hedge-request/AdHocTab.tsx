
import HedgeRequestGrid from "./new-grid/HedgeRequestGrid";

const AdHocTab = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">New Hedge Request</h2>
        <HedgeRequestGrid />
      </div>
    </div>
  );
};

export default AdHocTab;
