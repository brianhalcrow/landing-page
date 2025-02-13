const useErrorModal = (setShowError) => {
    const handleErrorModalClose = () => {
      setShowError(false);
    };
  
    return {
      handleErrorModalClose
    };
  };
  
  export default useErrorModal;
  