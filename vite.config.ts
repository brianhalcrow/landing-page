
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    middleware: (app) => {
      app.use((req, res, next) => {
        // SPA fallback for client-side routing
        if (req.method === 'GET' && !req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      });
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'ag-charts-enterprise',
      'ag-grid-react'
    ]
  },
}));
