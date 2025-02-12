
import React from 'react';
import { AgChartsReact } from 'ag-charts-enterprise';
import { AgChartOptions } from 'ag-charts-enterprise';

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
    <div className="w-[10cm] h-[10cm] mx-auto">
      <AgChartsReact options={chartOptions} />
    </div>
  );
};

export default TestAgChart;
