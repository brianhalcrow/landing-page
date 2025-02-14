// ExecutionReportModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ExecutionReportDetails from './ExecutionReportDetails.jsx';
import '../css/ExecutionReportModal.css';

const ExecutionReportModal = ({ show, message, onClose, executionReport, handleReset }) => {
  const bigIntReplacer = (key, value) => 
    typeof value === 'bigint' ? value.toString() : value;
  
  if (executionReport) {
    const executions = JSON.parse(localStorage.getItem('executions')) || [];
    executions.push({ date: new Date().toLocaleDateString(), ...executionReport });
    localStorage.setItem('executions', JSON.stringify(executions, bigIntReplacer));
  }
  
  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Execution Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {executionReport ? <ExecutionReportDetails executionReport={executionReport} /> : <pre>{message}</pre>}
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
