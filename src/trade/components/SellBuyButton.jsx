// SellBuyButton.jsx
import React from 'react';

const SellBuyButton = ({ buySell, setBuySell }) => (
  <button 
    className={`btn ${buySell === 'Sell' ? 'btn-danger' : 'btn-success'}`} 
    onClick={() => setBuySell(buySell === 'Sell' ? 'Buy' : 'Sell')}>
    {buySell}
  </button>
);

export default SellBuyButton;