
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";

const CHART_ID = 'hedge-requests-by-entity';
const MIN_CHART_HEIGHT = 200;
const MIN_CONTAINER_WIDTH = 300;
const DEFAULT_CONTAINER_WIDTH = '100%';

type InteractionState = 'IDLE' | 'DRAGGING' | 'RESIZING';

const ResizableChart = () => {
  const [chartHeight, setChartHeight] = useState(400);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH);
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Set initial position away from corner
  const [interactionState, setInteractionState] = useState<InteractionState>('IDLE');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // First query to get the user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // Fetch saved chart preferences
  const { data: chartPreferences } = useQuery({
    queryKey: ['chart-preferences', CHART_ID, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
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

  // Fetch hedge requests data
  const { data: hedgeRequests, isLoading: isLoadingHedgeRequests } = useQuery({
    queryKey: ['hedge-request-drafts-by-entity'],
    queryFn: async () => {
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

  // Set initial preferences
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
          x: chartPreferences.position_x || 20, // Fallback to 20 if null
          y: chartPreferences.position_y || 20 
        });
      }
    }
  }, [chartPreferences]);

  // Debounced save preferences function
  const saveChartPreferences = useCallback(
    debounce(async (
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
    }, 300),
    [user?.id]
  );

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

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (interactionState !== 'IDLE') return;
    
    e.preventDefault();
    setInteractionState('DRAGGING');
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    // Add event listeners to handle drag outside the component
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleInteractionEnd);
  };

  // Handle drag
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (interactionState !== 'DRAGGING') return;

    const parentRect = document.querySelector('.relative.min-h-[600px]')?.getBoundingClientRect();
    if (!parentRect) return;

    // Calculate new position
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // Calculate container dimensions
    const containerRect = document.querySelector('.resize.overflow-hidden')?.getBoundingClientRect();
    if (!containerRect) return;

    // Constrain to parent boundaries
    newX = Math.max(0, Math.min(newX, parentRect.width - containerRect.width));
    newY = Math.max(0, Math.min(newY, parentRect.height - containerRect.height));
    
    setPosition({ x: newX, y: newY });
    saveChartPreferences(chartHeight, containerWidth, newX, newY);
  }, [interactionState, dragStart, chartHeight, containerWidth, saveChartPreferences]);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (interactionState !== 'IDLE') return;
    
    e.stopPropagation(); // Prevent drag when resizing
    setInteractionState('RESIZING');

    // Add event listeners to handle resize outside the component
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleInteractionEnd);
  };

  // Handle resize
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (interactionState !== 'RESIZING') return;

    const container = document.querySelector('.resize.overflow-hidden');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newWidth = Math.max(MIN_CONTAINER_WIDTH, e.clientX - rect.left);
    const newHeight = Math.max(MIN_CHART_HEIGHT, e.clientY - rect.top);
    
    setChartHeight(newHeight);
    const widthString = `${newWidth}px`;
    setContainerWidth(widthString);
    
    saveChartPreferences(newHeight, widthString, position.x, position.y);
  }, [interactionState, position.x, position.y, saveChartPreferences]);

  // Handle all mouse up events
  const handleInteractionEnd = useCallback(() => {
    setInteractionState('IDLE');
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleInteractionEnd);
  }, [handleDragMove, handleResizeMove]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [handleDragMove, handleResizeMove, handleInteractionEnd]);

  return (
    <div 
      className="absolute"
      style={{ 
        left: position.x,
        top: position.y,
        cursor: interactionState === 'DRAGGING' ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleDragStart}
    >
      <div 
        className="resize overflow-hidden inline-block min-w-[300px]"
        style={{ 
          width: containerWidth,
          cursor: interactionState === 'RESIZING' ? 'se-resize' : undefined
        }}
      >
        <Card>
          <CardHeader 
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
          >
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
                <div 
                  className="absolute bottom-2 right-2 text-gray-400 cursor-se-resize p-2"
                  onMouseDown={handleResizeStart}
                >
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
