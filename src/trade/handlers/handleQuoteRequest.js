import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequest.js';
import { format } from 'date-fns';

const handleQuoteRequest = async ({
  tradeType,
  currencyPair,
  clientID,
  legs,
  sendMessage,
  handleClientIDCheck
}) => {
  console.log('In handleQuoteRequest');

  const clientIDCheckResult = handleClientIDCheck(clientID);
  if (clientIDCheckResult) return;

  const quoteRequest = {
    transactionType: tradeType.toUpperCase(),
    symbol: currencyPair,
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
    messageTime: BigInt(Date.now()),
    quoteRequestID: generateUUID(),
    clientID: clientID,
    legs: legs.map((leg) => ({
      amount: {
        mantissa: Math.round(leg.amount * Math.pow(10, 2)),
        exponent: -2
      },
      currency: leg.currency,
      valueDate: format(leg.valueDate, "yyyyMMdd"),
      side: leg.side.toUpperCase()
    }))
  };

  console.log('quoteRequest:', quoteRequest);

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeQuoteRequest(quoteRequest);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleQuoteRequest;
