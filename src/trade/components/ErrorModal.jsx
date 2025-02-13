import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/ErrorModal.css';

const ErrorModal = ({ show, message, onClose, error, handleReset }) => {
  const labels = [
    'Amount:',
    'Currency:',
    'Side:',
    'Symbol:',
    'Delivery Date:',
    'Transact Time:',
    'Quote Request ID:',
    'Quote ID:',
    'Deal Request ID:',
    'DealID:',
    'Rate:',
    'Secondary Amount:',
    'Client ID:',    
    'Message:'
  ];

  const values = error
    ? [
        error.amount,
        error.currency,
        error.side,
        error.symbol,
        error.deliveryDate,
        error.transactTime,
        error.quoteRequestID,
        error.quoteID,
        error.dealRequestID,
        error.dealID,
        error.rate,
        error.secondaryAmount,
        error.clientID,
        error.message
      ]
    : [];

  const handleClose = () => {
    handleReset(); // Call the reset handler
    onClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Error Received</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? (
          <div className="error-container">
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

export default ErrorModal;

