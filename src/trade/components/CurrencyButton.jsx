// CurrencyButton.jsx
import React from 'react';

const CurrencyButton = ({ currencyPair, setCurrencyPair }) => {
  const [base, terms] = currencyPair.split('/');

  return (
    <button 
      className="btn btn-secondary border" 
      onClick={() => setCurrencyPair(`${terms}/${base}`)}
    >
      {base} / {terms}
    </button>
  );
};

export default CurrencyButton;
