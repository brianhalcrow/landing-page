// FromCurrencyField.js
import React from 'react';
import FormField from './FormField.jsx';

const FromCurrencyField = ({ fromCurrency, setFromCurrency, toCurrency }) => (
  <FormField label="Currency I have:">
    <select className="form-control" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
      {['USD', 'EUR', 'GBP', 'CAD']
        .filter((currency) => currency !== toCurrency)
        .map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
    </select>
  </FormField>
);

export default FromCurrencyField;
