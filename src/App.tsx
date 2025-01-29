import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Configuration from "./pages/Configuration";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Settlement from "./pages/Settlement";
import Monitor from "./pages/Monitor";
import Review from "./pages/Review";
import Control from "./pages/Control";
import Execution from "./pages/Execution";
import Confirmation from "./pages/Confirmation";
import HedgeAccounting from "./pages/HedgeAccounting";
import DataSources from "./pages/DataSources";
import Exposure from "./pages/Exposure";
import Forecast from "./pages/Forecast";
import HedgeRequest from "./pages/HedgeRequest";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <ProtectedRoute>
                <Layout>
                  <Configuration />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-sources"
            element={
              <ProtectedRoute>
                <Layout>
                  <DataSources />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitor"
            element={
              <ProtectedRoute>
                <Layout>
                  <Monitor />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exposure"
            element={
              <ProtectedRoute>
                <Layout>
                  <Exposure />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecast"
            element={
              <ProtectedRoute>
                <Layout>
                  <Forecast />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hedge-request"
            element={
              <ProtectedRoute>
                <Layout>
                  <HedgeRequest />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <Layout>
                  <Review />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/control"
            element={
              <ProtectedRoute>
                <Layout>
                  <Control />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/execution"
            element={
              <ProtectedRoute>
                <Layout>
                  <Execution />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedRoute>
                <Layout>
                  <Confirmation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settlement"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settlement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hedge-accounting"
            element={
              <ProtectedRoute>
                <Layout>
                  <HedgeAccounting />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;