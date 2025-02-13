import encodeDealRequest from 'src/messages/encodeDealRequestV2.js';
import DealRequestDecoder from 'src/aeron/v2/DealRequestDecoder.js';
import MessageHeaderEncoder from 'src/aeron/MessageHeaderEncoder.js';
import MessageHeaderDecoder from 'src/aeron/MessageHeaderDecoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../../aeron/TextEncoder.js';
import TextDecoder from '../../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock dealRequestData
const data = {
    transactionType: 'SPO',
    symbol: 'EURUSD',
    transactTime: '20240101-00:00:00.000',
    messageTime: BigInt(Date.now()),
    quoteRequestID: 'QR123456',
    quoteID: 'QR123456.1',
    dealRequestID: 'DR123456',
    clientID: 'XXXX',
    legs: [
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'USD',
            side: 'BUY',
            valueDate: '250101',
            price: { mantissa: BigInt(125), exponent: -2 }
        },
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'USD',
            side: 'SELL',
            valueDate: '260101',
            price: { mantissa: BigInt(125), exponent: -2 }
        },
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'EUR',
            side: 'SELL',
            valueDate: '260101',
            price: { mantissa: BigInt(125), exponent: -2 }
        },
        {
            amount: { mantissa: BigInt(100000), exponent: 0 },
            currency: 'EUR',
            side: 'BUY',
            valueDate: '270101',
            price: { mantissa: BigInt(125), exponent: -2 }
        }
    ]
};

describe('DealRequest binary encoding and decoding', () => {
    it('should encode and decode DealRequest correctly', () => {
        // Encode the dealRequestData
        const encodedMessage = encodeDealRequest(data);
        console.log('Encoded buffer:', new Uint8Array(encodedMessage));
        const encodedArray = new Uint8Array(encodedMessage);
        const buffer = new Uint8Array(encodedArray).buffer;

        // Decode the received message
        const headerDecoder = new MessageHeaderDecoder();
        const decoder = new DealRequestDecoder();

        // Decode header & body
        headerDecoder.wrap(buffer, 0);
        decoder.wrap(buffer, MessageHeaderEncoder.ENCODED_LENGTH);

        // Decode legs
        const groupHeaderOffset = DealRequestDecoder.BLOCK_LENGTH + 8;
        const legs = decoder.decodeLeg(decoder.buffer, groupHeaderOffset);

        // Extract decoded data
        const decodedData = {
            transactionType: decoder.transactionType().replace(/\0/g, ''),
            symbol: decoder.symbol().replace(/\0/g, ''),
            transactTime: decoder.transactTime().replace(/\0/g, ''),
            messageTime: decoder.messageTime(),
            quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
            quoteID: decoder.quoteID().replace(/\0/g, ''),
            dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
            clientID: decoder.clientID().replace(/\0/g, ''),
            legs: legs.map(leg => ({
                amount: leg.amount,
                currency: leg.currency.replace(/\0/g, ''),
                side: leg.side.replace(/\0/g, ''),
                valueDate: leg.valueDate.replace(/\0/g, ''),
                price: leg.price
            }))
        };

        // Verify the decoded data matches the original data
        expect(decodedData).toEqual(data);
    });
});
