import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import DataSources from "@/pages/DataSources";
import Configuration from "@/pages/Configuration";
import Process from "@/pages/Process";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/process" element={<Process />} />
              <Route path="/hedge-request" element={<HedgeRequest />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/review" element={<Review />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/exposure" element={<Exposure />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/control" element={<Control />} />
              <Route path="/hedge-accounting" element={<HedgeAccounting />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
