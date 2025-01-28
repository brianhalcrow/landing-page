import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,234</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">56</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">89.3k</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">Analytics content</TabsContent>
        <TabsContent value="reports">Reports content</TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;