// ClientIDModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ClientIDModal = ({ show, message, onClose }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header>
      <Modal.Title>Client ID</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <pre>{message}</pre>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ClientIDModal;
