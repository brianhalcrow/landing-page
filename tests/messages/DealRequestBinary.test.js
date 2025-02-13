import encodeDealRequest from 'src/messages/encodeDealRequest.js';
import DealRequestDecoder from 'src/aeron/v1/DealRequestDecoder.js';
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

describe('DealRequest binary encoding and decoding', () => {
    it('should encode and decode DealRequest correctly', () => {
        // Encode the dealRequestData
        const encodedMessage = encodeDealRequest(data);
        console.log('Encoded buffer:', new Uint8Array(encodedMessage));
        const encodedArray = new Uint8Array(encodedMessage);

        // Decode the received message
        const decoder = new DealRequestDecoder();
        const buffer = new Uint8Array(encodedArray).buffer;
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        // Decode the fields
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

        // Verify the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});
