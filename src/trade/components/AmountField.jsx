// AmountField.jsx
import React from 'react';
import FormField from './FormField.jsx';

const AmountField = ({ amount, setAmount }) => (
  <FormField label="Amount:">
    <input type="number" className="form-control" value={amount} min="0" onChange={(e) => setAmount(e.target.value)} />
  </FormField>
);

export default AmountField;