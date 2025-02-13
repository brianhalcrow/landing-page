import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import WebSocketServer from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from 'src/contexts/WebSocketContext.js';
import QuoteEncoder from 'src/aeron/v2/QuoteEncoder.js';
import QuoteDecoder from 'src/aeron/v2/QuoteDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';
import MessageHeaderDecoder from 'src/aeron/MessageHeaderDecoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../../aeron/TextEncoder.js';
import TextDecoder from '../../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock quoteData
const data = {
    transactionType: 'SPO',
    symbol: 'EURUSD',
    transactTime: '20240101-00:00:00.000',
    messageTime: BigInt(Date.now()),
    quoteRequestID: 'QR123456',
    quoteID: 'QR123456.1',
    clientID: 'XXXX',
    legs: [
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'USD',
            side: 'BUY',
            valueDate: '250101',
            bid: { mantissa: BigInt(123456), exponent: -5 },
            offer: { mantissa: BigInt(134567), exponent: -5 }
        },
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'USD',
            side: 'SELL',
            valueDate: '260101',
            bid: { mantissa: BigInt(223456), exponent: -5 },
            offer: { mantissa: BigInt(234567), exponent: -5 }
        }
    ]
};

const TestComponent = () => {
    const { sendMessage } = useWebSocket();
    const sendTestMessage = () => {
        const groupHeaderLength = 4; // Adjust for legs header

        const bufferLength = QuoteEncoder.BLOCK_LENGTH +
                             MessageHeaderEncoder.ENCODED_LENGTH + 
                             groupHeaderLength +
                             data.legs.length * QuoteEncoder.LEG_BLOCK_LENGTH;; // Adjust for legs data
    
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new QuoteEncoder();
    
        // Encode the data
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    
        // Encode the main fields
        encoder.transactionType(data.transactionType)
                .symbol(data.symbol)
                .transactTime(data.transactTime)
                .messageTime(data.messageTime)
                .quoteID(data.quoteID)
                .quoteRequestID(data.quoteRequestID)
                .clientID(data.clientID);
    
        // Encode legs
        encoder.encodeLeg(data.legs); 

        sendMessage(buffer);
    };

    return <button onClick={sendTestMessage}>Send Quote</button>;
};

describe('WebSocket integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8290');
    });

    afterEach(() => {
        server.close();
    });

    it('sends a Quote message and decodes it correctly', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8290">
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
        const headerDecoder = new MessageHeaderDecoder();
        const decoder = new QuoteDecoder();
        const buffer = new Uint8Array(receivedMessage).buffer;

        // Decode header & body
        headerDecoder.wrap(buffer, 0);
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        // Decode legs
        const groupHeaderOffset = QuoteDecoder.BLOCK_LENGTH + 8;
        const legs = decoder.decodeLeg(decoder.buffer, groupHeaderOffset);

        console.log('Decoding received message...');

        // Extract decoded data
        const decodedData = {
            transactionType: decoder.transactionType().replace(/\0/g, ''),
            symbol: decoder.symbol().replace(/\0/g, ''),
            transactTime: decoder.transactTime().replace(/\0/g, ''),
            messageTime: decoder.messageTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            quoteID: decoder.quoteID().replace(/\0/g, ''),
            clientID: decoder.clientID().replace(/\0/g, ''),
            legs: legs.map(leg => ({
                amount: leg.amount,
                currency: leg.currency.replace(/\0/g, ''),
                side: leg.side.replace(/\0/g, ''),
                valueDate: leg.valueDate.replace(/\0/g, ''),
                bid: leg.bid,
                offer: leg.offer
            }))
        };

        // Verify the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});
