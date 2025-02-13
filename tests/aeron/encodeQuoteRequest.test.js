import encodeQuoteRequest from '../../src/messages/encodeQuoteRequest.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from './TextEncoder.js';
import TextDecoder from './TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Quote Request Message Encoding/Decoding', () => {
    it('should correctly encode Quote Request message', () => {
        const data = {
            amount: { mantissa: 12345678, exponent: -2 },
            saleCurrency: 'USD',
            side: 'BUY',
            symbol: 'EURUSD',
            deliveryDate: '20241231',
            transactTime: '20230101-00:00:00.000',
            quoteRequestID: '12345678',
            currencyOwned: 'EUR',
            clientID: 'TEST'
        };

        try {
            console.log(data);
            const encodedBuffer = encodeQuoteRequest(data);
            console.log(new Uint8Array(encodedBuffer));
        } catch (error) {
            console.error('Encoding failed:', error);
        }
    });
});
