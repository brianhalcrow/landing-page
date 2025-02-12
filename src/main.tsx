
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModuleRegistry, ClientSideRowModelModule, RowGroupingModule, EnterpriseCoreModule } from 'ag-grid-enterprise';
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  EnterpriseCoreModule
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
