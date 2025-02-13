import React, { useEffect, useState } from 'react';
import useCurrencyConversion from '../hooks/useCurrencyConversion.js';
import ClientIDModal from './ClientIDModal.jsx';
import ExecutionReportModal from './ExecutionReportModal.jsx';
import ErrorModal from './ErrorModal.jsx';
import SalePriceField from './SalePriceField.jsx';
import SaleCurrencyField from './SaleCurrencyField.jsx';
import DeliveryDateField from './DeliveryDateField.jsx';
import FromCurrencyField from './FromCurrencyField.jsx';
import ClientIDField from './ClientIDField.jsx';
import { addBusinessDays, isWeekday } from '../utils/utils.js';
import '../css/CurrencyConverter.css';

const CurrencyConverter = ({ amplifyUsername, kycComplete }) => {
  const [clientID, setClientID] = useState(amplifyUsername || '');

  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    isFormValid,
    clientIDMessage,
    showClientID,
    handleClientIDModalClose,
    quote,
    showQuote,
    handleQuoteRequest,
    handleDealRequest,
    executionReport,
    showExecutionReport,
    executionReportMessage,
    handleExecutionModalClose,
    error,
    showError,
    errorMessage,
    handleErrorModalClose,
    handleReset
  } = useCurrencyConversion(amplifyUsername);

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  useEffect(() => {
    console.log('showQuote:', showQuote);
    console.log('quote:', quote);
  }, [showQuote, quote]);  

  const checkDealRequest = (dealData) => {
    console.log('amplifyUsername:', amplifyUsername);

    if (!kycComplete) {
      console.log('kycComplete:', kycComplete);
    }

    dealData.clientID = amplifyUsername; // Set client for deal request
    console.log('dealData:', dealData);
    handleDealRequest(dealData);
  };

  return (
    <div className="converter-container">
      <ClientIDModal show={showClientID} message={clientIDMessage} onClose={handleClientIDModalClose} />
      <div className="card rounded p-4">
        <SalePriceField amount={amount} setAmount={setAmount} />
        <SaleCurrencyField toCurrency={toCurrency} setToCurrency={setToCurrency} />
        <DeliveryDateField 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          minDate={minDate} 
          maxDate={maxDate} 
          isWeekday={isWeekday} 
        />
        <FromCurrencyField fromCurrency={fromCurrency} setFromCurrency={setFromCurrency} toCurrency={toCurrency} />
        <ClientIDField clientID={clientID} setClientID={setClientID} amplifyUsername={amplifyUsername} />
        <div>
          <button
            className="btn btn-primary btn-block"
            onClick={handleQuoteRequest}
            disabled={!isFormValid}
            style={{ backgroundColor: isFormValid ? 'blue' : 'lightblue' }}
          >
            Convert
          </button>
        </div>

        {showQuote && (
          <div className="mt-3">
            <p>FX Rate: {(quote.fxRate ?? 0).toFixed(5)}</p>
            <p>Amount to pay: {(quote.secondaryAmount ?? 0).toFixed(2)} {quote.fromCurrency}</p>
          </div>
        )}

        {showQuote && (
          <div className="mt-3">
            <div className="form-group row align-items-center">
              <label className="col-sm-8 col-form-label text-right">Execute:</label>
              <div className="col-sm-4">
                <button 
                  className="btn btn-success mr-2" 
                  onClick={() => checkDealRequest({
                    amount,
                    toCurrency,
                    selectedDate,
                    fxRate: quote.fxRate,
                    secondaryAmount: quote.secondaryAmount,
                    symbol: quote.symbol,
                    quoteRequestID: quote.quoteRequestID,
                    quoteID: quote.quoteID
                  })}
                >
                  YES
                </button>
                <button className="btn btn-danger" onClick={handleReset}>NO</button>
              </div>
            </div>
          </div>
        )}

        {showExecutionReport && (
            <ExecutionReportModal 
              show={showExecutionReport} 
              message={executionReportMessage} 
              onClose={handleExecutionModalClose} 
              executionReport={executionReport}
              handleReset={handleReset} 
            />
        )}

        {showError && (
            <ErrorModal 
              show={showError} 
              message={errorMessage} 
              onClose={handleErrorModalClose} 
              error={error}
              handleReset={handleReset} 
            />
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
