// FxTrade.jsx
import React, { useEffect, useState } from 'react';
import useCurrencyConversion from '../hooks/useCurrencyConversion.js';
import ClientIDModal from './ClientIDModal.jsx';
import ExecutionReportModal from './ExecutionReportModal.jsx';
import ErrorModal from './ErrorModal.jsx';
import QuoteDetails from './QuoteDetails.jsx';
import CurrencyPairField from './CurrencyPairField.jsx';
import AccountField from './AccountField.jsx';
import TypeField from './TypeField.jsx';
import SellBuyButton from './SellBuyButton.jsx';
import CurrencyButton from './CurrencyButton.jsx';
import AmountField from './AmountField.jsx';
import TenorButton from './TenorButton.jsx';
import DeliveryDateField from './DeliveryDateField.jsx';
import QuoteGrid from './QuoteGrid.jsx';
import DealLog from './DealLog.jsx';
import ClientIDField from './ClientIDField.jsx';
import { addBusinessDays, isWeekday } from '../utils/utils.js';
import '../css/FxTrade.css';

import PropTypes from 'prop-types';

const FxTrade = ({ amplifyUsername, kycComplete }) => {
  const [clientID, setClientID] = useState(amplifyUsername || '');

  const {
    currencyPair,
    setCurrencyPair,
    account,
    setAccount,
    amount,
    setAmount,
    tradeType,
    setTradeType,
    buySell,
    setBuySell,
    tenor,
    setTenor,
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
    console.log('dealRequestData:', dealData);
    handleDealRequest(dealData);
  };

  return (
    <div className="fx-trade-container">
      <h2>FX Trade Entry</h2>
      <ClientIDModal show={showClientID} message={clientIDMessage} onClose={handleClientIDModalClose} />
      <div className="fx-trade-section">
        <CurrencyPairField currencyPair={currencyPair} setCurrencyPair={setCurrencyPair} />
        <AccountField account={account} setAccount={setAccount} />
        <ClientIDField clientID={clientID} setClientID={setClientID} amplifyUsername={amplifyUsername} />
        <TypeField tradeType={tradeType} setTradeType={setTradeType} />
      </div>

      <hr />
      <div className="fx-trade-section">
        <SellBuyButton buySell={buySell} setBuySell={setBuySell} />
        <CurrencyButton currencyPair={currencyPair} setCurrencyPair={setCurrencyPair} />
        <AmountField amount={amount} setAmount={setAmount} />
        <TenorButton tenor={tenor} setTenor={setTenor} />
        <DeliveryDateField 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          minDate={minDate} 
          maxDate={maxDate} 
          isWeekday={isWeekday} 
        />
      </div>
      <div>
        <button
          className="btn btn-primary btn-block"
          onClick={handleQuoteRequest}
          disabled={!isFormValid}
          style={{ backgroundColor: isFormValid ? 'blue' : 'lightblue' }}>
          Quote
        </button>
      </div>

      {showQuote && (
        <div className="mt-3">
          <div className="form-group row align-items-center">
            <label className="col-sm-8 col-form-label text-right">Execute:</label>
            <div className="col-sm-4">
              <button 
                className="btn btn-success mr-2" 
                onClick={() => checkDealRequest({
                  clientID,
                  tradeType,
                  buySell,
                  quoteRequestID: quote.quoteRequestID,
                  quoteID: quote.quoteID,
                  legs: quote.legs
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

      <hr />
      {showQuote && <QuoteGrid quote={quote} />}
      <DealLog />

    </div> 
  );
};

FxTrade.propTypes = {
  amplifyUsername: PropTypes.string.isRequired,
  kycComplete: PropTypes.bool.isRequired,
};

export default FxTrade;
