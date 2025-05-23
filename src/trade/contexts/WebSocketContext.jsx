
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import useWebSocketConnection from '../handlers/handleWebSocketConnection.js';
import incomingMessage from '../handlers/handleIncomingMessage.js';
import outgoingMessage from '../handlers/handleOutgoingMessage.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {
    // local state variable for incoming quotes
    const [quote, setQuote] = useState({
        transactionType: '',
        symbol: '',
        transactTime: '',
        messageTime: '',
        quoteID: '',
        quoteRequestID: '',
        clientID: '',
        legs: []
    });

    // local state variable for incoming deals
    const [executionReport, setExecutionReport] = useState({
        transactionType: '',
        symbol: '',
        transactTime: '',
        messageTime: '',
        quoteID: '',
        quoteRequestID: '',
        dealRequestID: '',
        dealID: '',
        clientID: '',
        legs: []
    });

    // local state variable for incoming errors
    const [error, setError] = useState({
        transactionType: '',
        symbol: '',
        transactTime: '',
        messageTime: '',
        quoteID: '',
        quoteRequestID: '',
        dealRequestID: '',
        dealID: '',
        clientID: '',
        message: '',
        legs: []
    });

    // Show panels or not depending on incoming messages
    const [showQuote, setShowQuote] = useState(false);
    const [showExecutionReport, setShowExecutionReport] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleIncomingMessageCallback = useCallback((data) => {
        incomingMessage(
            data,
            setQuote,
            setShowQuote,
            setExecutionReport,
            setShowExecutionReport,
            setError,
            setShowError
        );
    }, []);

    const socketRef = useWebSocketConnection(url, handleIncomingMessageCallback);
    const sendMessage = useMemo(() => outgoingMessage(socketRef), [socketRef]);

    const contextValue = useMemo(() => ({
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
    }), [
        sendMessage,
        quote,
        showQuote,
        executionReport,
        showExecutionReport,
        error,
        showError
    ]);

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export default WebSocketContext;
