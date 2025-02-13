// SalePriceField.js
import React from 'react';
import FormField from './FormField.jsx';

const SalePriceField = ({ amount, setAmount }) => (
  <FormField label="Item sale price:">
    <input
      type="number"
      className="form-control"
      value={amount}
      min="0"
      onChange={(e) => setAmount(Math.max(0, e.target.value))}
    />
  </FormField>
);

export default SalePriceField;
