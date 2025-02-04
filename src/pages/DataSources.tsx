import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DataSourcesGrid from "@/components/data-sources/DataSourcesGrid";
import { Skeleton } from "@/components/ui/skeleton";

const DataSources = () => {
  const { data: connections, isLoading } = useQuery({
    queryKey: ["table-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("table_connections")
        .select("*");

      if (error) {
        console.error("Error fetching connections:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="h-full">
      <TabsContainer 
        tabs={tabsConfig["data-sources"]} 
        defaultTab="connections" 
      />
      <div className="p-6">
        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : connections ? (
          <DataSourcesGrid connections={connections} />
        ) : (
          <div className="text-center text-muted-foreground">
            No data sources found
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSources;