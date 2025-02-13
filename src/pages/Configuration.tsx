
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EntityConfigurationTab from "@/components/configuration/entity/EntityConfigurationTab";
import ProcessConfigurationGrid from "@/components/configuration/grid/ProcessConfigurationGrid";

const Configuration = () => {
  return (
    <div className="flex-1 space-y-4 px-4 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
            <p className="text-muted-foreground">
              Manage your system configurations and settings
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="entities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
          </TabsList>
          <TabsContent value="entities" className="space-y-4">
            <EntityConfigurationTab />
          </TabsContent>
          <TabsContent value="process" className="space-y-4">
            <ProcessConfigurationGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
