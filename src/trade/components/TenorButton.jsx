// TenorButton.jsx
import React from 'react';
import FormField from './FormField.jsx';

const TenorButton = ({ tenor, setTenor }) => (
  <FormField label="Tenor:">
    <select className="form-control" value={tenor} onChange={(e) => setTenor(e.target.value)}>
      {['TOD', 'TOM', 'SPOT', '1W', '2W', '1M', '2M', '3M', '6M', '9M', '1Y'].map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  </FormField>
);

export default TenorButton;