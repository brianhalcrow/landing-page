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

      // Filter out RUNNING status if we have a COMPLETED status for the same pipeline execution
      const filteredData = data?.reduce((acc: any[], current: any) => {
        const existingIndex = acc.findIndex(item => 
          item.pipeline_name === current.pipeline_name && 
          item.start_time === current.start_time
        );

        if (existingIndex === -1) {
          // No existing record found, add this one
          acc.push(current);
        } else if (current.status === 'COMPLETED' && acc[existingIndex].status === 'RUNNING') {
          // Replace RUNNING with COMPLETED status
          acc[existingIndex] = current;
        }
        return acc;
      }, []);

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