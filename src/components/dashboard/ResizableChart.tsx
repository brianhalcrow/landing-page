
import { useEffect } from "react";
import { useChartPreferences } from "./hooks/useChartPreferences";
import { useChartData } from "./hooks/useChartData";
import { useChartInteractions } from "./hooks/useChartInteractions";
import ChartContainer from "./components/ChartContainer";

const ResizableChart = () => {
  const {
    containerWidth,
    setContainerWidth,
    position,
    setPosition,
    chartPreferences,
    saveChartPreferences,
  } = useChartPreferences();

  const { data: hedgeRequests, isLoading: isLoadingHedgeRequests } = useChartData();

  const {
    interactionState,
    position: currentPosition,
    containerWidth: currentWidth,
    handleDragStart,
    handleResizeStart
  } = useChartInteractions(
    position,
    containerWidth,
    setPosition,
    setContainerWidth,
    saveChartPreferences
  );

  // Set initial preferences
  useEffect(() => {
    if (chartPreferences) {
      if (chartPreferences.width) {
        setContainerWidth(parseInt(chartPreferences.width));
      }
      if (chartPreferences.position_x !== null && chartPreferences.position_y !== null) {
        setPosition({ 
          x: chartPreferences.position_x || 20,
          y: chartPreferences.position_y || 20 
        });
      }
    }
  }, [chartPreferences, setContainerWidth, setPosition]);

  const chartOptions = {
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

  return (
    <div 
      className="absolute"
      style={{ 
        left: currentPosition.x,
        top: currentPosition.y,
        cursor: interactionState === 'DRAGGING' ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleDragStart}
    >
      <ChartContainer
        isLoading={isLoadingHedgeRequests}
        chartOptions={chartOptions}
        onDragStart={handleDragStart}
        onResizeStart={handleResizeStart}
        containerWidth={currentWidth}
        interactionState={interactionState}
      />
    </div>
  );
};

export default ResizableChart;
