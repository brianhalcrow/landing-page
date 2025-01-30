import React from 'react';
import FXRatesGrid from './FXRatesGrid';

const PendingTab = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">FX Rates Monitor</h2>
      <FXRatesGrid />
    </div>
  );
};

export default PendingTab;