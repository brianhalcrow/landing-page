import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DataSourcesGrid from "@/components/data-sources/DataSourcesGrid";
import { Skeleton } from "@/components/ui/skeleton";
import PipelineRealtimeSubscription from "@/components/data-sources/PipelineRealtimeSubscription";

const DataSources = () => {
  const queryClient = useQueryClient();
  
  const { data: executions, isLoading } = useQuery({
    queryKey: ["pipeline-executions"],
    queryFn: async () => {
      console.log("🔍 Fetching pipeline executions...");
      const { data, error } = await supabase
        .from("pipeline_executions")
        .select("*")
        .order('start_time', { ascending: false });

      if (error) {
        console.error("Error fetching pipeline executions:", error);
        throw error;
      }

      // Group by pipeline_name and keep the most recent status
      const latestExecutions = data?.reduce((acc: { [key: string]: any }, current: any) => {
        const existing = acc[current.pipeline_name];
        
        // If no existing entry or current is more recent, update it
        if (!existing || new Date(current.start_time) > new Date(existing.start_time)) {
          acc[current.pipeline_name] = current;
        } else if (current.status === 'COMPLETED' && existing.status === 'RUNNING') {
          // If same timestamp but current is COMPLETED and existing is RUNNING, prefer COMPLETED
          acc[current.pipeline_name] = current;
        }
        
        return acc;
      }, {});

      // Convert back to array
      const filteredData = Object.values(latestExecutions);

      console.log("✅ Fetched pipeline executions:", filteredData);
      return filteredData;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const handleDataChange = async () => {
    console.log("🔄 Invalidating pipeline executions cache...");
    await queryClient.invalidateQueries({ queryKey: ["pipeline-executions"] });
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
