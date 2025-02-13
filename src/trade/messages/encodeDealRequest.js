import DealRequestEncoder from '../aeron/v2/TradeDealRequestEncoder.js';
import MessageHeaderEncoder from '../aeron/MessageHeaderEncoder.js'

const encodeDealRequest = (data) => {

    const groupHeaderLength = 4; // Adjust for legs header

    const bufferLength = DealRequestEncoder.BLOCK_LENGTH +
                         MessageHeaderEncoder.ENCODED_LENGTH + 
                         groupHeaderLength +
                         data.legs.length * DealRequestEncoder.LEG_BLOCK_LENGTH; // Adjust for legs data

    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new DealRequestEncoder();

    // Encode the data
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the main fields
    encoder.transactionType(data.transactionType)
            .symbol(data.symbol)
            .transactTime(data.transactTime)
            .messageTime(data.messageTime)
            .quoteRequestID(data.quoteRequestID)
            .quoteID(data.quoteID)
            .dealRequestID(data.dealRequestID)
            .clientID(data.clientID);

    // Encode legs
    encoder.encodeLeg(data.legs); 

    return buffer;
};

export default encodeDealRequest;

