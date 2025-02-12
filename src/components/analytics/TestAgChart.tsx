import React, { useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-community';
import type { AgChartOptions } from 'ag-charts-community';

const TestAgChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartOptions: AgChartOptions = {
    // ... your chart options
  };

  useEffect(() => {
    if (chartRef.current) {
      AgCharts.create({
        ...chartOptions,
        container: chartRef.current,
      });
    }
  }, []);

  return (
    <div className="w-[10cm] h-[10cm] mx-auto">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default TestAgChart;
