
import React from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

const TestAgChart = () => {
  const chartOptions: AgChartOptions = {
    title: {
      text: 'AG Charts Test',
    },
    data: [
      { quarter: 'Q1', revenue: 3000 },
      { quarter: 'Q2', revenue: 4500 },
      { quarter: 'Q3', revenue: 3200 },
      { quarter: 'Q4', revenue: 5100 },
    ],
    series: [{
      type: 'bar',
      xKey: 'quarter',
      yKey: 'revenue',
    }],
  };

  return (
    <div className="w-full h-[400px]">
      <AgChartsReact options={chartOptions} />
    </div>
  );
};

export default TestAgChart;
