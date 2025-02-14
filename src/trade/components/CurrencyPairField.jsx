// CurrencyPairField.jsx
import React from 'react';
import FormField from './FormField.jsx';

const CurrencyPairField = ({ currencyPair, setCurrencyPair }) => {
  const g20Currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD'];
  const pairs = g20Currencies.flatMap(base => g20Currencies.map(terms => base !== terms ? `${base}/${terms}` : null)).filter(Boolean);

  return (
    <FormField label="Currency Pair:">
      <select className="form-control" value={currencyPair} onChange={(e) => setCurrencyPair(e.target.value)}>
        {pairs.map(pair => (
          <option key={pair} value={pair}>{pair}</option>
        ))}
      </select>
    </FormField>
  );
};

export default CurrencyPairField;