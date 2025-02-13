import asyncio
import websockets
import logging

logging.basicConfig(level=logging.INFO)

TIINGO_WEBSOCKET_URL = 'wss://api.tiingo.com/fx'

# Handle browser WebSocket connection
async def handle_browser_connection(browser_ws):
    logging.info("Browser connected to proxy WebSocket")
    message_queue = []  # Queue for storing messages from the browser
    tiingo_ws = None
    message_count = 0  # Counter for messages sent to the browser

    try:
        # Connect to Tiingo WebSocket API
        logging.info("Connecting to Tiingo WebSocket")
        tiingo_ws = await websockets.connect(TIINGO_WEBSOCKET_URL)
        logging.info("Proxy connected to Tiingo WebSocket")

        # Function to forward queued messages to Tiingo
        async def flush_message_queue():
            while message_queue:
                message = message_queue.pop(0)
                if tiingo_ws.state == websockets.protocol.State.OPEN:
                    await tiingo_ws.send(message)
                    logging.info(f"Message to Tiingo: {message}")
                else:
                    logging.warning("Tiingo WebSocket is no longer open. Dropping queued message.")

        # Handle browser -> Tiingo
        async def forward_to_tiingo():
            async for message in browser_ws:
                logging.debug(f"Browser: {message}")
                if tiingo_ws.state == websockets.protocol.State.OPEN:
                    await tiingo_ws.send(message)
                    logging.info(f"Forwarded to Tiingo: {message}")
                else:
                    logging.warning("Tiingo WebSocket is closed. Queuing message.")
                    message_queue.append(message)

        # Handle Tiingo -> Browser
        async def forward_to_browser():
            nonlocal message_count  # Allow access to the counter
            async for message in tiingo_ws:
                await browser_ws.send(message)
                message_count += 1
                if message_count % 100 == 0:  # Log only once every 100 messages
                    logging.info(f"Forwarded message % 100 to browser: {message}")

        # Start forwarding tasks
        await asyncio.gather(
            forward_to_tiingo(),
            forward_to_browser(),
            flush_message_queue()
        )

    except websockets.exceptions.ConnectionClosed:
        logging.info("WebSocket connection closed")
    except Exception as e:
        logging.error(f"Error: {e}")
    finally:
        if tiingo_ws:
            await tiingo_ws.close()
        await browser_ws.close()
        logging.info("Cleaned up WebSocket connections")

# Start the WebSocket server
async def main():
    PORT = 3001
    logging.info(f"Starting WebSocket proxy server on port {PORT}")
    async with websockets.serve(handle_browser_connection, "0.0.0.0", PORT, ping_interval=None):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped")
