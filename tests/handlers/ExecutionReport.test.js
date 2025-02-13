import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import ExecutionReportEncoder from '../../src/aeron/v1/executionReportEncoder.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingExecutionReport', () => {
    it('should correctly decode and log an ExecutionReport message', () => {
        console.log('handleIncomingExecutionReport test');

        const data = {
            amount: {
                mantissa: 100000,
                exponent: -2
            },
            currency: 'USD',
            secondaryAmount: {
                mantissa: 200000,
                exponent: -2
            },
            secondaryCurrency: 'EUR',
            side: 'SELL',
            symbol: 'EURUSD',
            deliveryDate: '20240807',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'ER123456.1',
            quoteRequestID: 'QR123456',
            dealRequestID: 'DR123456',
            dealID: 'D123456',
            fxRate: {
                mantissa: 123450,
                exponent: -5
            },
        };

        console.log(data);
        console.log("Setup encoder");

        const bufferLength = ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new ExecutionReportEncoder();

        console.log("Encode");

        headerEncoder.wrap(buffer, 0)
            .blockLength(ExecutionReportEncoder.BLOCK_LENGTH)
            .templateId(2)
            .schemaId(1)
            .version(1);

        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.encodesecondaryAmount(data.secondaryAmount);
        encoder.secondaryCurrency(data.secondaryCurrency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.deliveryDate(data.deliveryDate);
        encoder.transactTime(data.transactTime);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.quoteID(data.quoteID);
        encoder.dealRequestID(data.dealRequestID);
        encoder.dealID(data.dealID);
        encoder.encodefxRate(data.fxRate);

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const mockSetExecutionReport = jest.fn();
        const mockSetShowExecutionReport = jest.fn();

        console.log("Incoming message");
        handleIncomingMessage(
            buffer,
            jest.fn(), // setQuote
            jest.fn(), // setShowQuote
            mockSetExecutionReport,
            mockSetShowExecutionReport,
            jest.fn(), // setError
            jest.fn() // setShowError
        );

        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', expect.any(Object));
        expect(mockSetExecutionReport).toHaveBeenCalledWith({
            dealID: data.dealID,
            amount: data.amount.mantissa * Math.pow(10, data.amount.exponent),
            currency: data.currency,
            symbol: data.symbol,
            deliveryDate: data.deliveryDate,
            secondaryCurrency: data.secondaryCurrency,
            rate: data.fxRate.mantissa * Math.pow(10, data.fxRate.exponent),
            secondaryAmount: data.secondaryAmount.mantissa * Math.pow(10, data.secondaryAmount.exponent),
        });

        expect(mockSetShowExecutionReport).toHaveBeenCalledWith(true);

        consoleSpy.mockRestore();
    });
});

