import encodeDealRequest from '../../src/messages/encodeDealRequest.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from './TextEncoder.js';
import TextDecoder from './TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Deal Request Message Encoding/Decoding', () => {
    it('should correctly encode Deal Request message', () => {

        const data = {
            amount: { mantissa: 100000, exponent: -2 },
            currency: 'USD',
            side: 'BUY',
            symbol: 'EURUSD',
            deliveryDate: '20241231',
            transactTime: '20230101-00:00:00.000',
            quoteRequestID: 'QR12345678',
            quoteID: 'QR12345678.1',
            dealRequestID: 'DR-1234-5678',
            fxRate: { mantissa: 123456, exponent: -5 }
        };

        try {
            console.log(data);
            const encodedBuffer = encodeDealRequest(data);
            console.log(new Uint8Array(encodedBuffer));
        } catch (error) {
            console.error('Encoding failed:', error);
        }
    });
});
