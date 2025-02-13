import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ExecutionReportModal.css';

const ExecutionReportModal = ({ show, message, onClose, executionReport, handleReset }) => {
  const labels = [
    'Deal ID:',
    'Sale Price:',
    'Sale Currency:',
    'Symbol:',
    'Delivery Date:',
    'FX Rate:',
    'Currency to Pay:',
    'Amount to Pay:'
  ];

  const values = executionReport
    ? [
        executionReport.dealID,
        executionReport.amount.toFixed(2),
        executionReport.currency,
        executionReport.symbol,
        executionReport.deliveryDate,
        executionReport.rate.toFixed(5),
        executionReport.secondaryCurrency,
        executionReport.secondaryAmount.toFixed(2)
      ]
    : [];

    const trade = {
      date: new Date().toLocaleDateString(),
      dealID: executionReport.dealID,
      salePrice: executionReport.amount.toFixed(2),
      saleCurrency: executionReport.currency,
      symbol: executionReport.symbol,
      deliveryDate: executionReport.deliveryDate,
      currencyIHave: executionReport.secondaryCurrency,
      fxRate: executionReport.rate.toFixed(5),
      amountToPay: executionReport.secondaryAmount.toFixed(2)
    };
  
    const executions = JSON.parse(localStorage.getItem('executions')) || [];
    executions.push(trade);
    localStorage.setItem('executions', JSON.stringify(executions));

  const handleClose = () => {
    handleReset(); // Call the reset handler
    onClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Execution Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {executionReport ? (
          <div className="execution-report-container">
            {labels.map((label, index) => (
              <React.Fragment key={index}>
                <div className="label">{label}</div>
                <div className="value">{values[index]}</div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <pre>{message}</pre>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExecutionReportModal;

