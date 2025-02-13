
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntityConfigurationTab from "@/components/configuration/entity/EntityConfigurationTab";
import ProcessConfigurationGrid from "@/components/configuration/grid/ProcessConfigurationGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Configuration = () => {
  const { data: entities, isLoading: entitiesLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order("entity_name");

      if (error) throw error;
      return data || [];
    },
  });

  const { data: processTypes, isLoading: processTypesLoading } = useQuery({
    queryKey: ["process_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("process_types")
        .select("*")
        .order("process_name");  // Changed from "name" to "process_name"

      if (error) throw error;
      return data || [];
    },
  });

  const isLoading = entitiesLoading || processTypesLoading;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 px-4 py-6">
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 px-4 py-6">
      <div className="space-y-4">
        <Tabs defaultValue="entities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
          </TabsList>
          <TabsContent value="entities" className="space-y-4">
            <EntityConfigurationTab />
          </TabsContent>
          <TabsContent value="process" className="space-y-4">
            <ProcessConfigurationGrid 
              entities={entities || []}
              processTypes={processTypes || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
