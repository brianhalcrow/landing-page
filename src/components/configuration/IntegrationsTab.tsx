import { useEntities } from "@/hooks/useEntities";
import { Skeleton } from "@/components/ui/skeleton";
import ConfigurationGrid from "./ConfigurationGrid";

const IntegrationsTab = () => {
  const { entities, isLoading, error } = useEntities();

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading entities. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <ConfigurationGrid entities={entities || []} />
      )}
    </div>
  );
};

export default IntegrationsTab;