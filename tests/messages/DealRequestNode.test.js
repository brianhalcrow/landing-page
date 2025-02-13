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
import encodeDealRequest from 'src/messages/encodeDealRequest.js';
import DealRequestDecoder from 'src/aeron/v1/DealRequestDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

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
    clientID: 'CLNT',
};

describe('WebSocket DealRequest Test', () => {
    let server, client, receivedMessage;

    beforeAll((done) => {
        // Setup a WebSocket server
        server = new WebSocketServer({ port: 8291 });
        server.on('connection', (ws) => {
            ws.on('message', (message) => {
                receivedMessage = message; // Capture the received message
                ws.send(message); // Echo back the same message
            });
        });

        // Setup a WebSocket client
        client = new WebSocket('ws://localhost:8291');
        client.on('open', done); // Wait for the connection to open
    });

    afterAll(() => {
        server.close();
        client.close();
    });

    test('encode, send, receive, decode, and assert', (done) => {
        // Step 2: Encode the message
        const encodedMessage = encodeDealRequest(data);

        // Step 3: Send the message on the WebSocket
        client.send(encodedMessage);

        // Step 4: Receive the message and decode it
        client.on('message', (message) => {
            // Decode the received message
            const decoder = new DealRequestDecoder();
            const buffer = new Uint8Array(message).buffer;
            decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

            console.log('Decoding received message...');

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
                clientID: decoder.clientID(),
            };

            console.log('Decoded data:', decodedData);

            // Step 6: Assert the decoded data matches the original data
            expect(decodedData).toEqual(data);

            done(); // Indicate the test is complete
        });
    });
});
