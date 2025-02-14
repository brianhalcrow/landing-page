import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ErrorDetails from './ErrorDetails.jsx';
import '../css/ErrorModal.css';

const ErrorModal = ({ show, message, onClose, error, handleReset }) => {
  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Error Received</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <ErrorDetails error={error} /> : <pre>{message}</pre>}
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
