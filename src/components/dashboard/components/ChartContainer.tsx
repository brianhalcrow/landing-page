import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AgCharts } from 'ag-charts-community';
import type { AgChartOptions } from 'ag-charts-community';
import { useEffect, useRef } from 'react';

// ... rest of your component code with AgCharts.create() instead of AgChartsReact

interface ChartContainerProps {
  isLoading: boolean;
  chartOptions: AgChartOptions;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  containerWidth: number;
  interactionState: 'IDLE' | 'DRAGGING' | 'RESIZING';
}

const ChartContainer = ({
  isLoading,
  chartOptions,
  onDragStart,
  onResizeStart,
  containerWidth,
  interactionState
}: ChartContainerProps) => {
  return (
    <div 
      className="resize-container"
      style={{ 
        width: containerWidth,
        cursor: interactionState === 'RESIZING' ? 'ew-resize' : undefined
      }}
    >
      <Card>
        <CardHeader 
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={onDragStart}
        >
          <CardTitle>Draft Hedge Requests by Entity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div 
              className="relative w-full overflow-hidden"
              style={{ height: 400 }}
            >
              <AgChartsReact options={chartOptions} />
              <div 
                className="absolute top-1/2 -translate-y-1/2 right-0 text-gray-400 cursor-ew-resize p-2"
                onMouseDown={onResizeStart}
              >
                <GripHorizontal className="h-4 w-4" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartContainer;
