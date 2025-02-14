import MessageHeaderDecoder from '../aeron/MessageHeaderDecoder.js';
import QuoteDecoder from '../aeron/v2/TradeQuoteDecoder.js';
import ExecutionReportDecoder from '../aeron/v2/TradeExecutionReportDecoder.js';
import ErrorDecoder from '../aeron/v2/TradeErrorDecoder.js';

const handleIncomingMessage = (data, setQuote, setShowQuote, setExecutionReport, setShowExecutionReport, setError, setShowError) => {
    console.log('Incoming data: ', data);

    // Check if data is an ArrayBuffer
    if (!(data instanceof ArrayBuffer)) {
        console.error('Data is not an ArrayBuffer:', data);
        return;
    }

    let decodedData;

    try {
        const headerDecoder = new MessageHeaderDecoder();

        // Wrap the header to read it
        headerDecoder.wrap(data, 0);

        switch (headerDecoder.templateId()) {
            case 2: { // Quote
                const decoder = new QuoteDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                // Extract and decode legs
                const groupHeaderOffset = QuoteDecoder.BLOCK_LENGTH + 8;
                const legs = decoder.decodeLeg(decoder.buffer, groupHeaderOffset);

                // Extract decoded data
                const decodedData = {
                    transactionType: decoder.transactionType().replace(/\0/g, ''),
                    symbol: decoder.symbol().replace(/\0/g, ''),
                    transactTime: decoder.transactTime().replace(/\0/g, ''),
                    messageTime: decoder.messageTime(),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    clientID: decoder.clientID().replace(/\0/g, ''),
                    legs: legs.map(leg => ({
                        amount: leg.amount,
                        currency: leg.currency.replace(/\0/g, ''),
                        valueDate: leg.valueDate.replace(/\0/g, ''),
                        side: leg.side.replace(/\0/g, ''),
                        bid: leg.bid,
                        offer: leg.offer
                    }))
                };

                setQuote(decodedData);

                console.log('setShowQuote');
                setShowQuote(true);

                break;
            }
            case 4: { // Execution Report
                const decoder = new ExecutionReportDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                // Extract and decode legs
                const groupHeaderOffset = QuoteDecoder.BLOCK_LENGTH + 8;
                const legs = decoder.decodeLeg(decoder.buffer, groupHeaderOffset);

                // Extract decoded data
                const decodedData = {
                    transactionType: decoder.transactionType().replace(/\0/g, ''),
                    symbol: decoder.symbol().replace(/\0/g, ''),
                    transactTime: decoder.transactTime().replace(/\0/g, ''),
                    messageTime: decoder.messageTime(),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
                    dealID: decoder.dealID().replace(/\0/g, ''),
                    clientID: decoder.clientID().replace(/\0/g, ''),
                    legs: legs.map(leg => ({
                        amount: leg.amount,
                        currency: leg.currency.replace(/\0/g, ''),
                        secondaryAmount: leg.secondaryAmount,
                        secondaryCurrency: leg.secondaryCurrency.replace(/\0/g, ''),
                        valueDate: leg.valueDate.replace(/\0/g, ''),
                        side: leg.side.replace(/\0/g, ''),
                        price: leg.price
                    }))
                };

                setExecutionReport(decodedData);

                setShowExecutionReport(true);

                break;
            }
            case 5: { // Error
                const decoder = new ErrorDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                // Extract and decode legs
                const groupHeaderOffset = QuoteDecoder.BLOCK_LENGTH + 8;
                const legs = decoder.decodeLeg(decoder.buffer, groupHeaderOffset);

                // Extract decoded data
                const decodedData = {
                    transactionType: decoder.transactionType().replace(/\0/g, ''),
                    symbol: decoder.symbol().replace(/\0/g, ''),
                    transactTime: decoder.transactTime().replace(/\0/g, ''),
                    messageTime: decoder.messageTime(),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
                    dealID: decoder.dealID().replace(/\0/g, ''),
                    clientID: decoder.clientID().replace(/\0/g, ''),
                    message: decoder.message().replace(/\0/g, ''),
                    legs: legs.map(leg => ({
                        amount: leg.amount,
                        currency: leg.currency.replace(/\0/g, ''),
                        secondaryAmount: leg.secondaryAmount,
                        secondaryCurrency: leg.secondaryCurrency.replace(/\0/g, ''),
                        valueDate: leg.valueDate.replace(/\0/g, ''),
                        side: leg.side.replace(/\0/g, ''),
                        price: leg.price
                    }))
                };

                setError(decodedData);

                setShowError(true);

                break;
            }
            default:
                console.error('Unknown message type:', headerDecoder.templateId());
                return;
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }

    console.log('Decoded Message:', decodedData);
};

export default handleIncomingMessage;
