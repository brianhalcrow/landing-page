import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/ws', createProxyMiddleware({
  target: 'wss://api.tiingo.com/fx',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug', // Logs detailed information about the proxying
  onProxyReqWs: (proxyReq, req, socket, options) => {
    proxyReq.setHeader('Sec-WebSocket-Extensions', ''); // Remove browser-specific extensions
    console.log('Proxying WebSocket request to:', options.target);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    if (res && !res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error: ' + err.message);
    }
  },
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});