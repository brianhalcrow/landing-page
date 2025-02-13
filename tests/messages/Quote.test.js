import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import WebSocketServer from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from 'src/contexts/WebSocketContext.js';

import QuoteEncoder from 'src/aeron/v1/QuoteEncoder.js'
import QuoteDecoder from 'src/aeron/v1/QuoteDecoder.js'
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const data = {
    amount: { mantissa: 1000, exponent: -2 },
    currency: 'USD',
    fxRate: { mantissa: 123456, exponent: -5 },
    side: 'BUY',
    symbol: 'EURUSD',
    transactTime: '20240101-00:00:00.000',
    quoteRequestID: 'test-request',
    quoteID: 'test-quote-id',
    secondaryAmount: { mantissa: 100, exponent: -2 },
};

const TestComponent = () => {
    const { sendMessage } = useWebSocket();
    const sendTestMessage = () => {

        const buffer = new ArrayBuffer(QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new QuoteEncoder();

        // Encode the quote
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.transactTime(data.transactTime);
        encoder.quoteID(data.quoteID);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.encodefxRate(data.fxRate);
        encoder.encodesecondaryAmount(data.secondaryAmount);

        // Send the message on the WebSocket
        sendMessage(buffer);
    };

    return <button onClick={sendTestMessage}>Send Quote</button>;
};

describe('WebSocket Quote integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8294');
    });

    afterEach(() => {
        WebSocketServer.clean();
    });

    it('receives a Quote message via WebSocket', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8294">
                <TestComponent />
            </WebSocketProvider>
        );

        await server.connected;
        await act(async () => {
            fireEvent.click(getByText('Send Quote'));
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
        const decoder = new QuoteDecoder();
        const buffer = new Uint8Array(receivedMessage).buffer;
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        console.log('Decoding received message...');

        const decodedData = {
            amount: decoder.decodeamount(),
            currency: decoder.currency(),
            side: decoder.side().replace(/\0/g, ''),
            symbol: decoder.symbol(),
            transactTime: decoder.transactTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            quoteID: decoder.quoteID().replace(/\0/g, ''),
            fxRate: decoder.decodefxRate(),
            secondaryAmount: decoder.decodesecondaryAmount()
        };

        // Assert the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});