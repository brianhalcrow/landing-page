import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataSources from "./pages/DataSources";
import Configuration from "./pages/Configuration";
import Monitor from "./pages/Monitor";
import Exposure from "./pages/Exposure";
import Forecast from "./pages/Forecast";
import HedgeRequest from "./pages/HedgeRequest";
import Review from "./pages/Review";
import Control from "./pages/Control";
import Execution from "./pages/Execution";
import Confirmation from "./pages/Confirmation";
import Settlement from "./pages/Settlement";
import HedgeAccounting from "./pages/HedgeAccounting";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/exposure" element={<Exposure />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/hedge-request" element={<HedgeRequest />} />
          <Route path="/review" element={<Review />} />
          <Route path="/control" element={<Control />} />
          <Route path="/execution" element={<Execution />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/settlement" element={<Settlement />} />
          <Route path="/hedge-accounting" element={<HedgeAccounting />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;