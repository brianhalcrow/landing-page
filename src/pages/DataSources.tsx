import { Skeleton } from "@/components/ui/skeleton";
import IntegrationsGrid from "@/components/integrations/IntegrationsGrid";
import { useEntities } from '@/hooks/useEntities';

const DataSources = () => {
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
      <h1 className="text-2xl font-bold mb-6">Data Sources</h1>
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <IntegrationsGrid entities={entities || []} />
      )}
    </div>
  );
};

export default DataSources;