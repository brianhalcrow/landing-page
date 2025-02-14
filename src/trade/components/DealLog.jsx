// DealLog.jsx
import React from 'react';
import '../css/DealLog.css';
import { convertBigDecimal } from '../utils/utils.js';

const DealLog = () => {
  const executions = JSON.parse(localStorage.getItem('executions')) || [];

  return (
    <div className="deal-log">
      <h5>Deal Log</h5>
      <div className="deal-log-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Symbol</th>
              <th>Transact Time</th>
              <th>Client ID</th>
              <th>Quote ID</th>
              <th>Quote Request ID</th>
              <th>Deal Request ID</th>
              <th>Deal ID</th>
              <th>Value Date</th>
              <th>Side</th>
              <th>Amount</th>
              <th>Secondary Amount</th>
              <th>Currency</th>
              <th>Secondary Currency</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((deal, index) => (
              <tr key={index}>
                <td>{deal.date}</td>
                <td>{deal.transactionType}</td>
                <td>{deal.symbol}</td>
                <td>{deal.transactTime}</td>
                <td>{deal.clientID}</td>
                <td>{deal.quoteID}</td>
                <td>{deal.quoteRequestID}</td>
                <td>{deal.dealRequestID}</td>
                <td>{deal.dealID}</td>
                <td>{deal.legs[0]?.valueDate}</td>
                <td>{deal.legs[0]?.side}</td>
                <td>{convertBigDecimal(deal.legs[0]?.amount)}</td>
                <td>{convertBigDecimal(deal.legs[0]?.secondaryAmount)}</td>
                <td>{deal.legs[0]?.currency}</td>
                <td>{deal.legs[0]?.secondaryCurrency}</td>
                <td>{convertBigDecimal(deal.legs[0]?.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealLog;
