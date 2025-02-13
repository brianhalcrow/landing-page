// FormField.js
import React from 'react';
import '../css/FormField.css'; // Make sure to import the CSS file

const FormField = ({ label, children }) => (
  <div className="form-field">
    <label className="form-label">{label}</label>
    <div className="form-input">
      {children}
    </div>
  </div>
);

export default FormField;
