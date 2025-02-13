
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntityConfigurationTab from "@/components/configuration/entity/EntityConfigurationTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Configuration = () => {
  const { data: entities, isLoading } = useQuery({
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
          </TabsList>
          <TabsContent value="entities" className="space-y-4">
            <EntityConfigurationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
