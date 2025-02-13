/**
 * @jest-environment node
 */

import { WebSocketServer, WebSocket } from 'ws'; // Websocket server

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock QuoteRequestDecoder and MessageHeaderEncoder
import encodeQuoteRequest from 'src/messages/encodeQuoteRequest.js';
import QuoteRequestDecoder from 'src/aeron/v1/QuoteRequestDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

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

describe('WebSocket Quote Request Test', () => {
    let server, client, receivedMessage;

    beforeAll((done) => {
        // Setup a WebSocket server
        server = new WebSocketServer({ port: 8297 });
        server.on('connection', (ws) => {
            ws.on('message', (message) => {
                receivedMessage = message; // Capture the received message
                ws.send(message); // Echo back the same message
            });
        });

        // Setup a WebSocket client
        client = new WebSocket('ws://localhost:8297');
        client.on('open', done); // Wait for the connection to open
    });

    afterAll(() => {
        server.close();
        client.close();
    });

    test('encode, send, receive, decode, and assert', (done) => {
        // Step 2: Encode the message
        const encodedMessage = encodeQuoteRequest(data);

        // Step 3: Send the message on the WebSocket
        client.send(encodedMessage);

        // Step 4: Receive the message and decode it
        client.on('message', (message) => {
            // Decode the received message
            const decoder = new QuoteRequestDecoder();
            const buffer = new Uint8Array(message).buffer;
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

            console.log('Decoded data:', decodedData);

            // Step 6: Assert the decoded data matches the original data
            expect(decodedData).toEqual(data);

            done(); // Indicate the test is complete
        });
    });
});