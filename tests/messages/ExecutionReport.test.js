import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import WebSocketServer from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from 'src/contexts/WebSocketContext.js';

import ExecutionReportEncoder from 'src/aeron/v1/ExecutionReportEncoder.js'
import ExecutionReportDecoder from 'src/aeron/v1/ExecutionReportDecoder.js'
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ExecutionReport data
const data = {
    amount: { mantissa: 1000, exponent: -2 },
    currency: 'USD',
    secondaryAmount: { mantissa: 2000, exponent: -2 },
    secondaryCurrency: 'USD',
    side: 'BUY',
    symbol: 'EURUSD',
    deliveryDate: '20230101',
    transactTime: '20240101-00:00:00.000',
    quoteRequestID: 'test-request',
    quoteID: 'test-quote-id',
    dealRequestID: 'test-request',
    dealID: 'test-deal-id',
    fxRate: { mantissa: 123456, exponent: -5 },
    clientID: 'CLNT'
};

const TestComponent = () => {
    const { sendMessage } = useWebSocket();
    const sendTestMessage = () => {
        // Encode the message
        const buffer = new ArrayBuffer(ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new ExecutionReportEncoder();
    
        // Encode the data
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.encodesecondaryAmount(data.secondaryAmount);
        encoder.secondaryCurrency(data.currency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.deliveryDate(data.deliveryDate);
        encoder.transactTime(data.transactTime);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.quoteID(data.quoteID);
        encoder.dealRequestID(data.dealRequestID);
        encoder.dealID(data.dealID);     
        encoder.encodefxRate(data.fxRate);
        encoder.clientID(data.clientID);

        // Send the message on the WebSocket
        sendMessage(buffer);
    };

    return <button onClick={sendTestMessage}>Send ExecutionReport</button>;
};

describe('WebSocket ExecutionReport integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8292');
    });

    afterEach(() => {
        WebSocketServer.clean();
    });

    it('receives an ExecutionReport message via WebSocket', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8292">
                <TestComponent />
            </WebSocketProvider>
        );

        await server.connected;
        await act(async () => {
            fireEvent.click(getByText('Send ExecutionReport'));
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
        const decoder = new ExecutionReportDecoder();
        const buffer = new Uint8Array(receivedMessage).buffer;
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        console.log('Decoding received message...');

        const decodedData = {
            amount: decoder.decodeamount(),
            currency: decoder.currency(),
            secondaryAmount: decoder.decodesecondaryAmount(),
            secondaryCurrency: decoder.secondaryCurrency(),
            side: decoder.side().replace(/\0/g, ''),
            symbol: decoder.symbol(),
            deliveryDate: decoder.deliveryDate(),
            transactTime: decoder.transactTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            quoteID: decoder.quoteID().replace(/\0/g, ''),
            dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
            dealID: decoder.dealID().replace(/\0/g, ''),
            fxRate: decoder.decodefxRate(),
            clientID: decoder.clientID(),
        };

        // Step 6: Assert the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});
