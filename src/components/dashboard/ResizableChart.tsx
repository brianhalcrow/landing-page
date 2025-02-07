
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CHART_ID = 'hedge-requests-by-entity';
const MIN_CHART_HEIGHT = 200;
const MIN_CONTAINER_WIDTH = 300;
const DEFAULT_CONTAINER_WIDTH = '100%';

const ResizableChart = () => {
  const [chartHeight, setChartHeight] = useState(400);
  const [chartWidth, setChartWidth] = useState('100%');
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

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
        .select('height, width, position_x, position_y')
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

  // Set initial height, width and position from preferences
  useEffect(() => {
    if (chartPreferences) {
      if (chartPreferences.height) {
        setChartHeight(chartPreferences.height);
      }
      if (chartPreferences.width) {
        setContainerWidth(chartPreferences.width);
      }
      if (chartPreferences.position_x !== null && chartPreferences.position_y !== null) {
        setPosition({ 
          x: chartPreferences.position_x, 
          y: chartPreferences.position_y 
        });
      }
    }
  }, [chartPreferences]);

  // Save chart preferences when dimensions or position change
  const saveChartPreferences = async (
    height: number, 
    width: string, 
    position_x: number, 
    position_y: number
  ) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('chart_preferences')
      .upsert({
        user_id: user.id,
        chart_id: CHART_ID,
        height,
        width,
        position_x,
        position_y
      }, {
        onConflict: 'user_id,chart_id'
      });

    if (error) {
      console.error('Error saving chart preferences:', error);
    }
  };

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
    padding: {
      top: 20,
      right: 40,
      bottom: 40,
      left: 40
    },
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dragging when resizing
    setIsResizing(true);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing) return;

    const element = e.currentTarget as HTMLDivElement;
    const newHeight = element.offsetHeight;
    const newWidth = element.offsetWidth;
    
    if (newHeight >= MIN_CHART_HEIGHT) {
      setChartHeight(newHeight);
    }
    
    if (newWidth >= MIN_CONTAINER_WIDTH) {
      const widthString = `${newWidth}px`;
      setChartWidth(widthString);
      setContainerWidth(widthString);
      
      // Save dimensions and current position
      saveChartPreferences(newHeight, widthString, position.x, position.y);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (isResizing) return; // Don't start dragging if we're resizing
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || isResizing) return;

    const newX = position.x + e.movementX;
    const newY = position.y + e.movementY;
    
    setPosition({ x: newX, y: newY });
    saveChartPreferences(chartHeight, containerWidth, newX, newY);
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onMouseLeave={() => {
        handleDragEnd();
        handleResizeEnd();
      }}
    >
      <div 
        className="mt-6 relative resize overflow-hidden cursor-se-resize inline-block min-w-[300px]"
        style={{ width: containerWidth }}
        onMouseDown={handleResizeStart}
        onMouseUp={handleResizeEnd}
        onMouseMove={handleResize}
      >
        <Card>
          <CardHeader>
            <CardTitle>Draft Hedge Requests by Entity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHedgeRequests ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <div 
                className="relative w-full min-h-[200px] overflow-hidden"
                style={{ height: chartHeight }}
              >
                <AgChartsReact options={chartOptions} />
                <div className="absolute bottom-2 right-2 text-gray-400">
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResizableChart;

