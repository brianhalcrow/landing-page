import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequest.js';
import { format } from 'date-fns';

const handleQuoteRequest = async ({
  clientID,
  amount,
  selectedDate,
  toCurrency,
  fromCurrency,
  sendMessage,
  handleClientIDCheck
}) => {
  const clientIDCheckResult = handleClientIDCheck(clientID, amount);
  if (clientIDCheckResult) return;

  // Prepare the data to encode
  const requestData = {
    amount: {
      mantissa: Math.round(amount * Math.pow(10, 2)),
      exponent: -2
    },
    saleCurrency: toCurrency,
    side: 'BUY',
    symbol: `${fromCurrency}${toCurrency}`,
    deliveryDate: format(selectedDate, 'yyyyMMdd'),
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
    quoteRequestID: generateUUID(),
    currencyOwned: fromCurrency,
    clientID: 'TEST'
  };

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeQuoteRequest(requestData);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleQuoteRequest;
