
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DataSourcesGrid from "@/components/data-sources/DataSourcesGrid";
import { Skeleton } from "@/components/ui/skeleton";
import PipelineRealtimeSubscription from "@/components/data-sources/PipelineRealtimeSubscription";

const ConnectionsTab = () => {
  const queryClient = useQueryClient();
  
  const { data: executions, isLoading } = useQuery({
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

      const latestExecutions = data?.reduce((acc: { [key: string]: any }, current: any) => {
        const existing = acc[current.pipeline_name];
        
        if (!existing || new Date(current.start_time) > new Date(existing.start_time)) {
          acc[current.pipeline_name] = current;
        } else if (current.status === 'COMPLETED' && existing.status === 'RUNNING') {
          acc[current.pipeline_name] = current;
        }
        
        return acc;
      }, {});

      return Object.values(latestExecutions);
    },
    refetchInterval: 10000,
  });

  const handleDataChange = async () => {
    await queryClient.invalidateQueries({ queryKey: ["pipeline-executions"] });
  };

  return (
    <div>
      <PipelineRealtimeSubscription onDataChange={handleDataChange} />
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
  );
};

export default ConnectionsTab;
