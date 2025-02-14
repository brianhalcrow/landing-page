// TypeField.jsx
import React from 'react';
import FormField from './FormField.jsx';

const TypeField = ({ tradeType, setTradeType }) => (
  <FormField label="Trade Type:">
    <select className="form-control" value={tradeType} onChange={(e) => setTradeType(e.target.value)}>
      <option value="SPO">Spot</option>
      <option value="FWD">Forward</option>
      <option value="SWA">Swap</option>
    </select>
  </FormField>
);

export default TypeField;