import React from 'react';
import CompletedRatesGrid from './CompletedRatesGrid';

const CompletedTab = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed FX Rates</h2>
      <CompletedRatesGrid />
    </div>
  );
};

export default CompletedTab;