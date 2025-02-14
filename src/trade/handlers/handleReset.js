import { addBusinessDays } from '../utils/utils.js';

const handleReset = ({
  setCurrencyPair,
  setAmount,
  setSelectedDate,
  setClientID,
  setQuote,
  setShowQuote,
  setExecutionReport,
  setShowExecutionReport,
  setError,
  setShowError
}) => {
  setCurrencyPair('EUR/USD');
  setAmount('');
  setSelectedDate(addBusinessDays(new Date(), 2));
  setClientID('');
  setQuote(null);
  setShowQuote(false);
  setExecutionReport(null);
  setShowExecutionReport(false);
  setError(null);
  setShowError(false);
};

export default handleReset;

