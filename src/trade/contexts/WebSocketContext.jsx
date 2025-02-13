import React, { createContext, useContext, useState } from 'react';
import useWebSocketConnection from '../handlers/handleWebSocketConnection.js';
import incomingMessage from '../handlers/handleIncomingMessage.js';
import outgoingMessage from '../handlers/handleOutgoingMessage.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {

    // local state variable for incoming quotes
    const [quote, setQuote] = useState({
        fxRate: 0,
        secondaryAmount: 0,
        symbol: '',
        quoteRequestID: '',
        quoteID: ''
      });

    // local state variable for incoming deals
    const [executionReport, setExecutionReport] = useState({
        dealID: '',
        amount: 0,
        currency: '',
        symbol: '',
        deliveryDate: '',
        secondaryCurrency: '',
        rate: 0,
        secondaryAmount: 0
      });

    // local state variable for incoming errors
    const [error, setError] = useState({
        amount: 0,
        currency: '',
        side: '',
        symbol: '',
        deliveryDate: '',
        transactTime: '',
        quoteRequestID: '',
        quoteID: '',
        dealRequestID: '',
        dealID: '',
        rate: 0,
        secondaryAmount: 0,
        clientID: '',
        message: ''
      });

    // Show panels or not depending on incoming messages
    const [showQuote, setShowQuote] = useState(false);
    const [showExecutionReport, setShowExecutionReport] = useState(false);
    const [showError, setShowError] = useState(false);

    const socketRef = useWebSocketConnection(url, (data) => incomingMessage(data, setQuote, setShowQuote, setExecutionReport, setShowExecutionReport, setError, setShowError));
    const sendMessage = outgoingMessage(socketRef);

    return (
        <WebSocketContext.Provider 
            value={{
                sendMessage,
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
                setShowError
            }}>
                {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

