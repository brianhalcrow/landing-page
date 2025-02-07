import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { GripDots } from "lucide-react";

const CHART_ID = 'hedge-requests-by-entity';
const MIN_CHART_HEIGHT = 200;

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

      return Object.entries(entityCounts).map(([entity, count]) => ({
        entity,
        count
      }));
    }
  });

  const chartOptions: AgChartOptions = {
    title: {
      text: 'Draft Hedge Requests by Entity',
    },
    data: hedgeRequests || [],
    series: [{
      type: 'bar',
      xKey: 'entity',
      yKey: 'count',
      yName: 'Number of Requests',
    }],
    axes: [{
      type: 'category',
      position: 'bottom',
      label: {
        rotation: -45,
      },
    }, {
      type: 'number',
      position: 'left',
    }],
  };

  const handleResize = (element: HTMLDivElement) => {
    if (!element) return;
    const newHeight = element.offsetHeight;
    if (newHeight >= MIN_CHART_HEIGHT) {
      setChartHeight(newHeight);
      saveChartPreferences(newHeight);
    }
  };

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
                <div 
                  className="relative w-full min-h-[200px] resize-y overflow-hidden"
                  style={{ height: chartHeight }}
                  onMouseUp={(e) => handleResize(e.currentTarget)}
                >
                  <AgChartsReact options={chartOptions} />
                  <div className="absolute bottom-2 right-2 text-gray-400">
                    <GripDots className="h-4 w-4" />
                  </div>
                </div>
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
