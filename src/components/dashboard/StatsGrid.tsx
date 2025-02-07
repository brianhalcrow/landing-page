
import StatsCard from "./StatsCard";

const StatsGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard title="Total Users" value="1,234" />
      <StatsCard title="Active Sessions" value="56" />
      <StatsCard title="Data Points" value="89.3k" />
    </div>
  );
};

export default StatsGrid;
