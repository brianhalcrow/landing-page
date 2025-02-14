import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useFormValidation from './useFormValidation.js';
import useClientIDHandling from './useClientIDHandling.js';
import useQuoteHandling from './useQuoteHandling.js';
import useDealHandling from './useDealHandling.js';
import useErrorHandling from './useErrorHandling.js';
import useExecutionModal from './useExecutionModal.js';
import useErrorModal from './useErrorModal.js';
import { useWebSocket } from '../contexts/WebSocketContext.jsx'; 
import prepareQuoteRequest from '../handlers/handleQuoteRequest.js';
import prepareDealRequest from '../handlers/handleDealRequest.js';
import prepareReset from '../handlers/handleReset.js';

const useCurrencyConversion = (amplifyUsername) => {
  // Align with websocket
  const { 
    quote, 
    setQuote, 
    showQuote,
    setShowQuote,
    executionReport, 
    setExecutionReport,
    showExecutionReport,
    setShowExecutionReport, 
    error, 
    setError, 
    showError,
    setShowError,
    sendMessage 
  } = useWebSocket();

  // Main panel variables
  const [currencyPair, setCurrencyPair] = useState('EUR/USD');
  const [account, setAccount] = useState('Break');
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState('Spot');
  const [buySell, setBuySell] = useState('Sell');
  const [tenor, setTenor] = useState('SPOT');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));

  // Form validation
  const isFormValid = useFormValidation(amount);

  // ClientID status
  const [clientID, setClientID] = useState(amplifyUsername || 'test');
  const [clientIDMessage, setClientIDMessage] = useState('');
  const [showClientID, setShowClientID] = useState(false);

  // Execution message
  const [executionReportMessage, setExecutionReportMessage] = useState('');

  // Error message
  const [errorMessage, setErrorMessage] = useState('');

  const { handleClientIDCheck, handleClientIDModalClose } = useClientIDHandling(
    amplifyUsername,
    setClientID,
    setClientIDMessage,
    setShowClientID
  );

  const { handleQuoteMessage } = useQuoteHandling(setQuote);
  const { handleExecutionReport } = useDealHandling(setExecutionReport, setExecutionReportMessage, setShowExecutionReport);
  const { handleErrorMessage } = useErrorHandling(setError, setErrorMessage, setShowError);
  const { handleExecutionModalClose } = useExecutionModal(setShowExecutionReport);
  const { handleErrorModalClose } = useErrorModal(setShowError);

  const handleQuoteRequest = () => {
    const baseCurrency = currencyPair.split('/')[0];
    const formattedCurrencyPair = currencyPair.replace('/', '');
  
    const legs = [
      {
        amount: parseFloat(amount),
        currency: baseCurrency, 
        valueDate: selectedDate.toISOString().split('T')[0],
        side: buySell
      }
    ];
  
    prepareQuoteRequest({
      tradeType,
      currencyPair: formattedCurrencyPair,
      clientID,
      legs,
      sendMessage,
      handleClientIDCheck
    });
  };
  
  const handleDealRequest = () => { 
    if (!quote || !quote.legs || quote.legs.length === 0) {
      console.error("No valid quote legs available for deal request.");
      return;
    }
  
    const formattedCurrencyPair = currencyPair.replace('/', '');
  
    // Transform quote to dealRequest legs
    const dealRequestLegs = quote.legs.map((leg) => ({
      amount: leg.amount,
      currency: leg.currency,
      valueDate: leg.valueDate,
      side: leg.side,
      price: leg.side === "SELL" ? leg.bid : leg.offer  // Select price based on side
    }));

    console.log("Deal Request Legs:", dealRequestLegs);
  
    prepareDealRequest({
      tradeType,
      currencyPair: formattedCurrencyPair,
      clientID,
      quoteRequestID: quote.quoteRequestID,
      quoteID: quote.quoteID,
      legs: dealRequestLegs,
      sendMessage
    });
  };
  
  const handleReset = () => {
    prepareReset({
      setCurrencyPair,
      setAccount,
      setAmount,
      setTradeType,
      setBuySell,
      setTenor,
      setSelectedDate,
      setClientID,
      setQuote,
      setShowQuote,
      setExecutionReport,
      setShowExecutionReport,
      setError,
      setShowError
    });
  
    // Explicitly reset clientID if needed
    setClientID(amplifyUsername || 'test');
  };
  

  return {
    currencyPair,
    setCurrencyPair,
    account,
    setAccount,
    tradeType,
    setTradeType,
    buySell,
    setBuySell,
    tenor,
    setTenor,
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    isFormValid,
    clientID,
    setClientID,
    clientIDMessage,
    showClientID,
    handleClientIDModalClose,
    quote, 
    showQuote,
    setShowQuote,
    handleQuoteRequest,
    handleQuoteMessage,
    handleDealRequest,
    executionReport,
    showExecutionReport,
    setShowExecutionReport,
    handleExecutionReport,
    executionReportMessage,
    handleExecutionModalClose,
    error,
    showError,
    setShowError,
    handleErrorMessage,
    errorMessage,
    handleErrorModalClose,
    handleReset,
  };
};

export default useCurrencyConversion;
