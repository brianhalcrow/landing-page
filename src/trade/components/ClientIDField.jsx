// ClientIDField.jsx
import React from 'react';
import FormField from './FormField.jsx';

const ClientIDField = ({ clientID, setClientID, amplifyUsername }) => {
  return (
    <FormField label="My client ID:">
      <select
        className="form-control"
        value={clientID}
        onChange={(e) => setClientID(e.target.value)}
      >
        <option value="" disabled>Select Client ID</option>
        <option value="TEST">TEST</option>
        <option value="Other">Other</option>
        <option value={amplifyUsername}>{amplifyUsername}</option>
      </select>
    </FormField>
  );
};

export default ClientIDField;

