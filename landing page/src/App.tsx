import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/sections/Hero";
import { Features, EarlyAccessSection } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Workflow } from "@/components/sections/Workflow";
import { CallToAction } from "@/components/sections/CallToAction";
import { CloudInfrastructure } from "@/components/sections/CloudInfrastructure";
import LoginPage from "@/pages/login";
import ContactUs from "@/pages/contact-us";
import GetAccess from "@/pages/get-access";
import AboutUs from "@/pages/about-us";
import Blog from "@/pages/blog";
import Solutions from "@/pages/solutions";
import WhySenseFX from "@/pages/why-sensefx";

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <EarlyAccessSection />
      <CloudInfrastructure />
      <CallToAction />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <MainLayout>
              <ContactUs />
            </MainLayout>
          }
        />
        <Route
          path="/get-access"
          element={
            <MainLayout>
              <GetAccess />
            </MainLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <Blog />
            </MainLayout>
          }
        />
        <Route
          path="/solutions"
          element={
            <MainLayout>
              <Solutions />
            </MainLayout>
          }
        />
        <Route
          path="/why-sensefx"
          element={
            <MainLayout>
              <WhySenseFX />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
