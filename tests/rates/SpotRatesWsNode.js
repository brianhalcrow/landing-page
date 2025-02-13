import WebSocket from 'ws';

const TIINGO_API_KEY = '205c3dcff9feb9ea22b221c5a828d6acb71a7319';
const TIINGO_WEBSOCKET_URL = 'wss://api.tiingo.com/fx';

const socket = new WebSocket(TIINGO_WEBSOCKET_URL);

socket.on('open', () => {
  console.log('WebSocket connection established');
  const subscriptionMessage = {
    eventName: 'subscribe',
    authorization: TIINGO_API_KEY,
    eventData: { tickers: ['eurusd', 'audusd'] },
  };
  socket.send(JSON.stringify(subscriptionMessage));
  console.log('Subscription message sent');
});

socket.on('message', (data) => {
  try {
    // Decode the Buffer data to a string and parse as JSON
    const decodedMessage = JSON.parse(data.toString('utf-8'));

    // Process and display human-readable output for quote messages
    if (decodedMessage.messageType === 'A' && decodedMessage.data) {
        console.log(
            `Message: Type=${decodedMessage.data[0]} | ` +
            `Ticker=${decodedMessage.data[1]} | ` +
            `Timestamp=${decodedMessage.data[2]} | ` +
            `VolumeBid=${decodedMessage.data[3]} | ` +
            `BidPrice=${decodedMessage.data[4]} | ` +
            `MidPrice=${decodedMessage.data[5]} | ` +
            `VolumeAsk=${decodedMessage.data[6]} | ` +
            `AskPrice=${decodedMessage.data[7]}`
        );
    }

    // Handle other message types if needed
    if (decodedMessage.messageType === 'H') {
      console.log('Heartbeat received');
    }
    if (decodedMessage.messageType === 'I') {
      console.log(`Subscription successful. Subscription ID: ${decodedMessage.data?.subscriptionId}`);
    }
  } catch (error) {
    console.error('Error parsing message:', error.message);
  }
});

socket.on('close', (code, reason) => {
  console.log(`WebSocket closed (code: ${code}, reason: ${reason || 'none'})`);
  // Optionally, implement reconnection logic here
});

socket.on('error', (err) => {
  console.error('WebSocket error:', err.message || err);
});
