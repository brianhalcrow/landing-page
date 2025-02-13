const useDealMessageHandling = (setDealData) => {
  const handleDealMessage = (dealData) => {
    setDealData(dealData);
  };

  return {
    handleDealMessage
  };
};

export default useDealMessageHandling;
