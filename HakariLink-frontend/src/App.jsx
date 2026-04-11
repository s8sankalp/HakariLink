import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import LinksPage from "./pages/LinksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import ShortenModal from "./components/ShortenModal";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="links" element={<LinksPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* Global Modals */}
        <ShortenModal />
      </BrowserRouter>
    </AuthProvider>
  );
}
