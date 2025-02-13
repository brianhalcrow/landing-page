const useQuoteMessageHandling = (setQuoteData) => {
    const handleQuoteMessage = (quoteData) => {
      setQuoteData(quoteData);
    };
  
    return {
      handleQuoteMessage
    };
  };
  
  export default useQuoteMessageHandling;
  