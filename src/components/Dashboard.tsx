
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StatsGrid from "./dashboard/StatsGrid";
import ResizableChart from "./dashboard/ResizableChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TabsList className="justify-start overflow-x-auto bg-gray-100 dark:bg-gray-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Overview
            </TabsTrigger>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="mt-6">
          <StatsGrid />
          <div className="relative min-h-[600px] mt-6">
            <ResizableChart />
          </div>
        </TabsContent>
        <TabsContent value="analytics">Analytics content</TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
