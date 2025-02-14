import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequest.js';
import { format } from 'date-fns';

const handleDealRequest = async ({
  tradeType,
  currencyPair,
  clientID,
  quoteRequestID,
  quoteID,
  legs,
  sendMessage
}) => {
  console.log('Received clientID in handleDealRequest:', clientID);

  const dealRequest = {
    transactionType: tradeType.toUpperCase(),
    symbol: currencyPair,
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
    messageTime: BigInt(Date.now()),
    quoteRequestID: quoteRequestID,
    quoteID: quoteID,
    dealRequestID: generateUUID(),
    clientID: clientID,
    legs: legs.map((leg) => ({
      amount: leg.amount,
      currency: leg.currency,
      valueDate: leg.valueDate,
      side: leg.side.toUpperCase(),
      price: leg.price
    }))
  };

  console.log('dealRequest:', dealRequest);

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeDealRequest(dealRequest);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleDealRequest;
