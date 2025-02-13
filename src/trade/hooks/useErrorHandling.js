const useErrorMessageHandling = (setErrorData) => {
  const handleErrorMessage = (errorData) => {
    setErrorData(errorData);
  };

  return {
    handleErrorMessage
  };
};

export default useErrorMessageHandling;
