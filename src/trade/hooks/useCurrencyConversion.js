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
  const [fromCurrency, setFromCurrency] = useState('EUR'); // Default from ccy is EUR
  const [toCurrency, setToCurrency] = useState('USD'); // Default to ccy is USD
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));

  // Form validation
  const isFormValid = useFormValidation(fromCurrency, toCurrency, amount);

  // ClientID status
  const [clientID, setClientID] = useState(amplifyUsername || '');
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

  const handleQuoteRequest = () => prepareQuoteRequest({
    clientID,
    amount,
    selectedDate,
    toCurrency,
    fromCurrency,
    sendMessage,
    handleClientIDCheck
  });

  const handleDealRequest = () => prepareDealRequest({
    amount,
    toCurrency,
    selectedDate,
    fromCurrency,
    fxRate: quote.fxRate,
    secondaryAmount: quote.secondaryAmount,
    symbol: quote.symbol,
    quoteRequestID: quote.quoteRequestID,
    quoteID: quote.quoteID,
    clientID,
    sendMessage
  });

  const handleReset = () => prepareReset({
    setFromCurrency,
    setToCurrency,
    setAmount,
    setSelectedDate,
    setClientID,
    setQuote,
    setShowQuote,
    setExecutionReport,
    setShowExecutionReport,
    setError,
    setShowError
  });

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
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
