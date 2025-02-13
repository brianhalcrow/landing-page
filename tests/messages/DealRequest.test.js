import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import WebSocketServer from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from 'src/contexts/WebSocketContext.js';
import encodeDealRequest from 'src/messages/encodeDealRequest.js';
import DealRequestDecoder from 'src/aeron/v1/DealRequestDecoder.js'
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock dealRequestData
const data = {
    amount: { mantissa: 1000, exponent: -2 },
    currency: 'USD',
    side: 'BUY',
    symbol: 'EURUSD',
    deliveryDate: '20230101',
    transactTime: '20240101-00:00:00.000',
    quoteRequestID: 'test-request',
    quoteID: 'test-quote-id',
    dealRequestID: 'test-request',
    fxRate: { mantissa: 123456, exponent: -5 },
    secondaryAmount: { mantissa: 2000, exponent: -2 },
    clientID: 'CLNT'
};

const TestComponent = () => {
    const { sendMessage } = useWebSocket();
    const sendTestMessage = () => {
        const encodedMessage = encodeDealRequest(data);
        sendMessage(encodedMessage);
    };

    return <button onClick={sendTestMessage}>Send DealRequest</button>;
};

describe('WebSocket integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8290');
    });

    afterEach(() => {
        server.close();
    });

    it('sends a DealRequest message and decodes it correctly', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8290">
                <TestComponent />
            </WebSocketProvider>
        );
    
        await server.connected;
        await act(async () => {
            fireEvent.click(getByText('Send DealRequest'));
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
        const decoder = new DealRequestDecoder();
        const buffer = new Uint8Array(receivedMessage).buffer;
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        console.log('Decoding received message...');

        // Decode the data
        const decodedData = {
            amount: decoder.decodeamount(),
            currency: decoder.currency(),
            side: decoder.side().replace(/\0/g, ''),
            symbol: decoder.symbol(),
            deliveryDate: decoder.deliveryDate(),
            transactTime: decoder.transactTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            quoteID: decoder.quoteID().replace(/\0/g, ''),
            dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
            fxRate: decoder.decodefxRate(),
            secondaryAmount: decoder.decodesecondaryAmount(),
            clientID: decoder.clientID()
        };

        // Check if the decoded data matches the expected data
        expect(decodedData).toEqual(data);
    });
});
