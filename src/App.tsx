
import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import DataSources from "@/pages/DataSources";
import Configuration from "@/pages/Configuration";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HedgeRequest from "@/pages/HedgeRequest";
import Settings from "@/pages/Settings";
import Monitor from "@/pages/Monitor";
import Review from "@/pages/Review";
import Forecast from "@/pages/Forecast";
import Exposure from "@/pages/Exposure";
import Confirmation from "@/pages/Confirmation";
import Control from "@/pages/Control";
import Execution from "@/pages/Execution";
import HedgeAccounting from "@/pages/HedgeAccounting";
import CashManagement from "@/pages/CashManagement";
import Process from "@/pages/Process";
import Settlement from "@/pages/Settlement";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Index />} />
        <Route path="data-sources" element={<DataSources />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="hedge-request" element={<HedgeRequest />} />
        <Route path="settings" element={<Settings />} />
        <Route path="monitor" element={<Monitor />} />
        <Route path="review" element={<Review />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="exposure" element={<Exposure />} />
        <Route path="execution" element={<Execution />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="control" element={<Control />} />
        <Route path="hedge-accounting" element={<HedgeAccounting />} />
        <Route path="cash-management" element={<CashManagement />} />
        <Route path="process" element={<Process />} />
        <Route path="settlement" element={<Settlement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
