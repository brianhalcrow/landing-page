
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useEffect, useState } from "react";

const CHART_ID = 'hedge-requests-by-entity';

const Dashboard = () => {
  const [chartHeight, setChartHeight] = useState(400);

  // First query to get the user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // Fetch saved chart preferences only when we have the user
  const { data: chartPreferences } = useQuery({
    queryKey: ['chart-preferences', CHART_ID, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log('Fetching chart preferences...');
      const { data, error } = await supabase
        .from('chart_preferences')
        .select('height')
        .eq('chart_id', CHART_ID)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching chart preferences:', error);
        throw error;
      }

      return data;
    }
  });

  // Set initial height from preferences
  useEffect(() => {
    if (chartPreferences?.height) {
      setChartHeight(chartPreferences.height);
    }
  }, [chartPreferences]);

  // Save chart preferences when height changes
  const saveChartPreferences = async (height: number) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('chart_preferences')
      .upsert({
        user_id: user.id,
        chart_id: CHART_ID,
        height
      }, {
        onConflict: 'user_id,chart_id'
      });

    if (error) {
      console.error('Error saving chart preferences:', error);
    }
  };

  const { data: hedgeRequests, isLoading: isLoadingHedgeRequests } = useQuery({
    queryKey: ['hedge-request-drafts-by-entity'],
    queryFn: async () => {
      console.log('Fetching hedge requests by entity...');
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select('entity_name');

      if (error) {
        console.error('Error fetching hedge requests:', error);
        throw error;
      }

      // Process data for the chart
      const entityCounts = data.reduce((acc: { [key: string]: number }, curr) => {
        const entityName = curr.entity_name || 'Unspecified';
        acc[entityName] = (acc[entityName] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(entityCounts).map(([name, value]) => ({
        entity: name,
        count: value
      }));
    }
  });

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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Draft Hedge Requests by Entity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHedgeRequests ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <ResizablePanelGroup direction="vertical" className="min-h-[400px] max-h-[600px]">
                  <ResizablePanel
                    defaultSize={50}
                    onResize={(size) => {
                      const newHeight = Math.round((size / 100) * 600); // Using 600 as max height
                      setChartHeight(newHeight);
                      saveChartPreferences(newHeight);
                    }}
                  >
                    <div className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hedgeRequests || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="entity" 
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" name="Number of Requests" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">Analytics content</TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
