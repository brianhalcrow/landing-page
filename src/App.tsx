
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { CubeProvider } from './integrations/cube/context/CubeProvider';
import Router from './Router';

function App() {
  return (
    <ThemeProvider>
      <CubeProvider>
        <Router />
        <Toaster />
      </CubeProvider>
    </ThemeProvider>
  );
}

export default App;
