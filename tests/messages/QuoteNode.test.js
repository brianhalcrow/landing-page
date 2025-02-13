/**
 * @jest-environment node
 */

import { WebSocketServer, WebSocket } from 'ws'; // Websocket server

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock QuoteDecoder and MessageHeaderEncoder
import QuoteEncoder from 'src/aeron/v1/QuoteEncoder.js';
import QuoteDecoder from 'src/aeron/v1/QuoteDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';

const data = {
    amount: { mantissa: 1000, exponent: -2 },
    currency: 'USD',
    fxRate: { mantissa: 100, exponent: -2 },
    transactTime: '20240101-00:00:00.000',
    side: 'BUY',
    symbol: 'EURUSD',
    quoteID: 'test-quote-id',
    quoteRequestID: 'test-request',
    secondaryAmount: { mantissa: 123456, exponent: -5 },
};

describe('WebSocket Quote Test', () => {
    let server, client, receivedMessage;

    beforeAll((done) => {
        // Setup a WebSocket server
        server = new WebSocketServer({ port: 8295 });
        server.on('connection', (ws) => {
            ws.on('message', (message) => {
                receivedMessage = message; // Capture the received message
                ws.send(message); // Echo back the same message
            });
        });

        // Setup a WebSocket client
        client = new WebSocket('ws://localhost:8295');
        client.on('open', done); // Wait for the connection to open
    });

    afterAll(() => {
        server.close();
        client.close();
    });

    test('encode, send, receive, decode, and assert', (done) => {
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

        client.send(buffer);

        // Step 4: Receive the message and decode it
        client.on('message', (message) => {
            // Decode the received message
            const decoder = new QuoteDecoder();
            const buffer = new Uint8Array(message).buffer;
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

            console.log('Decoded data:', decodedData);

            // Step 6: Assert the decoded data matches the original data
            expect(decodedData).toEqual(data);

            done(); // Indicate the test is complete
        });
    });
});