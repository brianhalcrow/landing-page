import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import ErrorEncoder from '../../src/aeron/v1/errorEncoder.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingError', () => {
    it('should correctly decode and log an Error message', () => {
        console.log('handleIncomingError test');

        const data = {
            amount: { mantissa: 500000, exponent: -2 },
            currency: 'GBP',
            side: 'BUY',
            symbol: 'GBPUSD',
            deliveryDate: '20240807',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'ER654321.1',
            quoteRequestID: 'QR654321',
            dealRequestID: 'DR654321',
            dealID: 'D654321',
            clientID: 'TEST',
            fxRate: { mantissa: 134560, exponent: -5 },
            secondaryAmount: { mantissa: 672800, exponent: -2 },
            message: 'Error processing the request due to invalid input parameters.',
        };

        const bufferLength = ErrorEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new ErrorEncoder();

        headerEncoder.wrap(buffer, 0)
            .blockLength(ErrorEncoder.BLOCK_LENGTH)
            .templateId(5)
            .schemaId(1)
            .version(1);

        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.deliveryDate(data.deliveryDate);
        encoder.transactTime(data.transactTime);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.quoteID(data.quoteID);
        encoder.dealRequestID(data.dealRequestID);
        encoder.dealID(data.dealID);
        encoder.clientID(data.clientID);
        encoder.encodefxRate(data.fxRate);
        encoder.encodesecondaryAmount(data.secondaryAmount);
        encoder.message(data.message);

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const mockSetError = jest.fn();
        const mockSetShowError = jest.fn();

        handleIncomingMessage(
            buffer,
            jest.fn(), // setQuote
            jest.fn(), // setShowQuote
            jest.fn(), // setExecutionReport
            jest.fn(), // setShowExecutionReport
            mockSetError,
            mockSetShowError,
        );

        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', expect.any(Object));
        expect(mockSetError).toHaveBeenCalledWith({
            amount: data.amount.mantissa * Math.pow(10, data.amount.exponent),
            currency: data.currency,
            side: data.side,
            symbol: data.symbol,
            deliveryDate: data.deliveryDate,
            transactTime: data.transactTime,
            quoteID: data.quoteID,
            quoteRequestID: data.quoteRequestID,
            dealRequestID: data.dealRequestID,
            dealID: data.dealID,
            clientID: data.clientID,
            rate: data.fxRate.mantissa * Math.pow(10, data.fxRate.exponent),
            secondaryAmount: data.secondaryAmount.mantissa * Math.pow(10, data.secondaryAmount.exponent),
            message: data.message,
        });
        expect(mockSetShowError).toHaveBeenCalledWith(true);

        consoleSpy.mockRestore();
    });
});

