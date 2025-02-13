import QuoteRequestEncoder from '../aeron/v2/TradeQuoteRequestEncoder.js';
import MessageHeaderEncoder from '../aeron/MessageHeaderEncoder.js'

const encodeQuoteRequest = (data) => {

    const groupHeaderLength = 4; // Adjust for legs header

    const bufferLength = QuoteRequestEncoder.BLOCK_LENGTH +
                         MessageHeaderEncoder.ENCODED_LENGTH + 
                         groupHeaderLength +
                         data.legs.length * QuoteRequestEncoder.LEG_BLOCK_LENGTH; // Adjust for legs data

    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new QuoteRequestEncoder();

    // Encode the data
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the main fields
    encoder.transactionType(data.transactionType)
            .symbol(data.symbol)
            .transactTime(data.transactTime)
            .messageTime(data.messageTime)
            .quoteRequestID(data.quoteRequestID)
            .clientID(data.clientID);

    // Encode legs
    encoder.encodeLeg(data.legs); 

    return buffer;
};

export default encodeQuoteRequest;

