import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import WebSocketServer from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from 'src/contexts/WebSocketContext.js';

import encodeQuoteRequest from 'src/messages/encodeQuoteRequest.js';
import QuoteRequestDecoder from 'src/aeron/v1/QuoteRequestDecoder.js'
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const data = {
    amount: { mantissa: 1000, exponent: -2 },
    saleCurrency: 'USD',
    deliveryDate: '20230101',
    transactTime: '20240101-00:00:00.000',
    quoteRequestID: 'test-request',
    side: 'BUY',
    symbol: 'EURUSD',
    currencyOwned: 'EUR',
    clientID: 'TEST'
};

const TestComponent = () => {
    const { sendMessage } = useWebSocket();
    const sendTestMessage = () => {
        const encodedMessage = encodeQuoteRequest(data);
        sendMessage(encodedMessage);
    };

    return <button onClick={sendTestMessage}>Send Quote Request</button>;
};

describe('WebSocket Quote Request integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8296');
    });

    afterEach(() => {
        WebSocketServer.clean();
    });

    it('receives a Quote Request message via WebSocket', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8296">
                <TestComponent />
            </WebSocketProvider>
        );

        await server.connected;
        await act(async () => {
            fireEvent.click(getByText('Send Quote Request'));
        });

        // Allow server to process the message
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Log all server messages
        console.log('Server messages after sending:', server.messages);
    
        // Verify the message was received on the server
        const messages = server.messages.filter(
            (message) => !(typeof message === 'string' && message.includes('Connection established'))
        );
        expect(messages).toHaveLength(1);
    
        // Received message
        const receivedMessage = messages[0];
        console.log('Received message:', receivedMessage);

        // Decode the received message
        const decoder = new QuoteRequestDecoder();
        const buffer = new Uint8Array(receivedMessage).buffer;
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        console.log('Decoding received message...');

        const decodedData = {
            amount: decoder.decodeamount(),
            saleCurrency: decoder.saleCurrency().replace(/\0/g, ''),
            deliveryDate: decoder.deliveryDate(),
            currencyOwned: decoder.currencyOwned().replace(/\0/g, ''),
            side: decoder.side().replace(/\0/g, ''),
            symbol: decoder.symbol(),
            transactTime: decoder.transactTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            clientID: decoder.clientID().replace(/\0/g, '')
        };

        // Assert the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});