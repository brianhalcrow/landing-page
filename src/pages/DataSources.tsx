import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DataSourcesGrid from "@/components/data-sources/DataSourcesGrid";
import { Skeleton } from "@/components/ui/skeleton";
import PipelineRealtimeSubscription from "@/components/data-sources/PipelineRealtimeSubscription";

const DataSources = () => {
  const { data: executions, isLoading, refetch } = useQuery({
    queryKey: ["pipeline-executions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pipeline_executions")
        .select("*")
        .order('start_time', { ascending: false });

      if (error) {
        console.error("Error fetching pipeline executions:", error);
        throw error;
      }

      return data;
    },
  });

  const handleDataChange = async () => {
    console.log("🔄 Refreshing pipeline executions data...");
    await refetch();
  };

  return (
    <div className="h-full">
      <PipelineRealtimeSubscription onDataChange={handleDataChange} />
      <TabsContainer 
        tabs={tabsConfig["data-sources"]} 
        defaultTab="connections" 
      />
      <div className="p-6">
        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : executions ? (
          <DataSourcesGrid executions={executions} />
        ) : (
          <div className="text-center text-muted-foreground">
            No pipeline executions found
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSources;