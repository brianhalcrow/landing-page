// SpotRatesWs.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
const textDecoder = new TextDecoder();

const TIINGO_API_KEY = '205c3dcff9feb9ea22b221c5a828d6acb71a7319';
// This requires a proxy WebSocket URL for browsers
const TIINGO_WEBSOCKET_URL = 'wss://ws.sensefx.io/ws/'; 

const useTiingoSpotRates = (baseCurrency: string) => {
  const [spotRates, setSpotRates] = useState<Record<string, number>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const termCurrencies = ["USD", "GBP", "EUR", "JPY", "CHF", "AUD", "CAD", "NOK", "DKK", "MXN"];

  const tickers = useMemo(
    () => termCurrencies.filter(currency => currency !== baseCurrency.toUpperCase())
      .map(currency => `${baseCurrency.toLowerCase()}${currency.toLowerCase()}`),
    [baseCurrency]
  );

  const connectWebSocket = () => {
    if (socketRef.current) {
      console.log("WebSocket is already connected.");
      return;
    }

    console.log('Attempting to connect to WebSocket...');
    const socket = new WebSocket(TIINGO_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      reconnectRef.current = false; // Don't try and connect again
      const subscriptionMessage = {
        eventName: 'subscribe',
        authorization: TIINGO_API_KEY,
        eventData: {
          thresholdLevel: 5,
          tickers: tickers,
        },
      };
      socket.send(JSON.stringify(subscriptionMessage));
    };

    socket.onmessage = async (event) => {
      try {
        let data;

        // Handle WebSocket data based on its type
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          data = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Error reading Blob'));
            reader.readAsText(event.data);
          });
        } else if (typeof event.data === 'string') {
          data = event.data;
        } else if (event.data instanceof ArrayBuffer) {
          data = new TextDecoder().decode(event.data);
        } else {
          throw new Error('Unsupported WebSocket data type');
        }

        // Handle undefined data case
        if (data === 'undefined') {
          data = '';
        }

        // Parse the JSON message
        const message = JSON.parse(data);

        // Log the raw WebSocket message for debugging
        console.log('rate: ', message);

        if (Array.isArray(message.data)) {
          setSpotRates((prevRates) => ({
            ...prevRates,
            data: message.data,
          }));    
        }
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error.message);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      if (reconnectRef.current) {
        console.log("Retrying connection...");
        retryTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error, 'ReadyState:', socket.readyState);
      reconnectRef.current = true; // Enable retry conditionally
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  };

  useEffect(() => {
    reconnectRef.current = true; // Enable retry
    connectWebSocket();

    return () => {
      reconnectRef.current = false; // Disable retries on unmount
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [tickers]);

  return spotRates;
};

export default useTiingoSpotRates;
