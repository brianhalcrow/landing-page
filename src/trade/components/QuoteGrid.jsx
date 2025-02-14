// QuoteGrid.jsx
import React from 'react';
import { convertBigDecimal } from '../utils/utils.js';
import '../css/QuoteGrid.css';

const QuoteGrid = ({ quote }) => {
  if (!quote || !quote.legs || quote.legs.length === 0) {
    return (
      <div className="quote-grid">
        <h5>Quote Details</h5>
        <p>No quote available</p>
      </div>
    );
  }

  // Extract first leg bid/offer
  const firstLeg = quote.legs[0] || {};
  const bid = firstLeg.bid ? convertBigDecimal(firstLeg.bid).toFixed(5) : "N/A";
  const ask = firstLeg.offer ? convertBigDecimal(firstLeg.offer).toFixed(5) : "N/A";

  const banks = [
    { name: 'BANK1', bid, ask },
    { name: 'BANK2', bid: bid !== "N/A" ? (parseFloat(bid) + 0.0001).toFixed(5) : "N/A", ask: ask !== "N/A" ? (parseFloat(ask) + 0.0001).toFixed(5) : "N/A" },
    { name: 'BANK3', bid: bid !== "N/A" ? (parseFloat(bid) - 0.0003).toFixed(5) : "N/A", ask: ask !== "N/A" ? (parseFloat(ask) - 0.0003).toFixed(5) : "N/A" },
    { name: 'BANK4', bid, ask }
  ];

  return (
    <div className="quote-grid">
      <h5>Quote Grid</h5>
      <table>
        <thead>
          <tr>
            <th>Bank</th>
            <th>Bid</th>
            <th>Ask</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.name}>
              <td>{bank.name}</td>
              <td>{bank.bid}</td>
              <td>{bank.ask}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteGrid;
