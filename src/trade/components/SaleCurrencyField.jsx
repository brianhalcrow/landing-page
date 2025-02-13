// SaleCurrencyField.js
import React from 'react';
import FormField from './FormField.jsx';

const SaleCurrencyField = ({ toCurrency, setToCurrency }) => (
  <FormField label="Sale currency:">
    <select className="form-control" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
      <option value="CAD">CAD</option>
    </select>
  </FormField>
);

export default SaleCurrencyField;
