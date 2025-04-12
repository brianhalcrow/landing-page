import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Workflow } from "@/components/sections/Workflow";
import { CallToAction } from "@/components/sections/CallToAction";
import LoginPage from "@/pages/login";
import ContactUs from "@/pages/contact-us";

function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <Workflow />
      <CallToAction />
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
