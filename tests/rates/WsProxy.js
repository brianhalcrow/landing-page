import express from 'express';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

const app = express();
const PORT = 3001;

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket Proxy
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Browser connected to proxy WebSocket');

  // Create a WebSocket client to connect to the Tiingo WebSocket API
  const tiingoSocket = new WebSocket('wss://api.tiingo.com/fx');
  const messageQueue = []; // Queue for storing messages from the browser
  let isTiingoConnected = false; // Track Tiingo connection status

  // Handle Tiingo WebSocket open event
  tiingoSocket.on('open', () => {
    console.log('Proxy connected to Tiingo WebSocket');
    isTiingoConnected = true;

    // Flush queued messages to Tiingo
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      tiingoSocket.send(message);
      console.log('Message to Tiingo:', message.toString());
    }
  });

  // Forward messages from Tiingo to the browser
  tiingoSocket.on('message', (message) => {
    ws.send(message);
  });

  tiingoSocket.on('close', () => {
    console.log('Tiingo WebSocket closed');
    ws.close();
  });

  tiingoSocket.on('error', (err) => {
    console.error('Error with Tiingo WebSocket:', err.message);
    ws.close();
  });

  // Handle messages from the browser
  ws.on('message', (message) => {
    console.debug('Browser:', message);
    if (isTiingoConnected) {
      tiingoSocket.send(message); // Forward message directly to Tiingo
    } else {
      console.log('Tiingo WebSocket is not open. Queuing message.');
      messageQueue.push(message); // Queue the message
    }
  });

  ws.on('close', () => {
    console.log('Browser WebSocket closed');
    tiingoSocket.close();
  });

  ws.on('error', (err) => {
    console.error('Error with browser WebSocket:', err.message);
    tiingoSocket.close();
  });
});
