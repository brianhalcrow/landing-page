// AccountField.jsx
import React from 'react';
import FormField from './FormField.jsx';

const AccountField = ({ account, setAccount }) => (
  <FormField label="Account:">
    <select className="form-control" value={account} onChange={(e) => setAccount(e.target.value)}>
      <option value="Break">Break</option>
      <option value="Corporate">Corporate</option>
      <option value="Hedge Fund">Hedge Fund</option>
    </select>
  </FormField>
);

export default AccountField;