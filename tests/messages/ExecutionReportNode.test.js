/**
 * @jest-environment node
 */

import { WebSocketServer, WebSocket } from 'ws'; // Websocket server

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock DealRequestDecoder and MessageHeaderEncoder
import ExecutionReportEncoder from 'src/aeron/v1/ExecutionReportEncoder.js';
import ExecutionReportDecoder from 'src/aeron/v1/ExecutionReportDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

const data = {
    amount: { mantissa: 1000, exponent: -2 },
    currency: 'USD',
    secondaryAmount: { mantissa: 2000, exponent: -2 },
    secondaryCurrency: 'USD', // 
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

describe('WebSocket ExecutionReport Test', () => {
    let server, client, receivedMessage;

    beforeAll((done) => {
        // Setup a WebSocket server
        server = new WebSocketServer({ port: 8293 });
        server.on('connection', (ws) => {
            ws.on('message', (message) => {
                receivedMessage = message; // Capture the received message
                ws.send(message); // Echo back the same message
            });
        });

        // Setup a WebSocket client
        client = new WebSocket('ws://localhost:8293');
        client.on('open', done); // Wait for the connection to open
    });

    afterAll(() => {
        server.close();
        client.close();
    });

    test('encode, send, receive, decode, and assert', (done) => {
        // Step 2: Encode the message
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

        // Step 3: Send the message on the WebSocket
        client.send(buffer);

        // Step 4: Receive the message and decode it
        client.on('message', (message) => {
            // Decode the received message
            const decoder = new ExecutionReportDecoder();
            const buffer = new Uint8Array(message).buffer;
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

            console.log('Decoded data:', decodedData);

            // Step 6: Assert the decoded data matches the original data
            expect(decodedData).toEqual(data);

            done(); // Indicate the test is complete
        });
    });
});
