const useExecutionModal = (setShowReport) => {
    const handleExecutionModalClose = () => {
      setShowReport(false);
    };
  
    return {
      handleExecutionModalClose
    };
  };
  
  export default useExecutionModal;
  