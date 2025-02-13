import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import QuoteEncoder from '../../src/aeron/v1/quoteEncoder.js'
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingQuote', () => {
    it('should correctly decode and log a Quote message', () => {
        console.log('handleIncomingQuote test');

        const data = {
            amount: { mantissa: 100000, exponent: -2 },
            currency: 'USD',
            side: 'BUY',
            symbol: 'EURUSD',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'QR123456.1',
            quoteRequestID: 'QR123456',
            fxRate: { mantissa: 123450, exponent: -5 },
            secondaryAmount: { mantissa: 123450, exponent: -2 },
        };

        const bufferLength = QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new QuoteEncoder();

        headerEncoder.wrap(buffer, 0)
            .blockLength(QuoteEncoder.BLOCK_LENGTH)
            .templateId(4)
            .schemaId(1)
            .version(1);

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

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const mockSetQuote = jest.fn();
        const mockSetShowQuote = jest.fn();

        handleIncomingMessage(
            buffer,
            mockSetQuote,
            mockSetShowQuote,
            jest.fn(), // setExecutionReport
            jest.fn(), // setShowExecutionReport
            jest.fn(), // setError
            jest.fn(), // setShowError
        );

        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', expect.any(Object));
        expect(mockSetQuote).toHaveBeenCalledWith({
            fxRate: data.fxRate.mantissa * Math.pow(10, data.fxRate.exponent),
            secondaryAmount: data.secondaryAmount.mantissa * Math.pow(10, data.secondaryAmount.exponent),
            symbol: data.symbol,
            quoteRequestID: data.quoteRequestID,
            quoteID: data.quoteID,
        });
        expect(mockSetShowQuote).toHaveBeenCalledWith(true);

        consoleSpy.mockRestore();
    });
});

