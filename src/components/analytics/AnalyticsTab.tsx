
import React from 'react';
import TestAgChart from './TestAgChart';

const AnalyticsTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="border rounded-lg p-4 bg-white inline-block">
        <TestAgChart />
      </div>
    </div>
  );
};

export default AnalyticsTab;
