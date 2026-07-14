// FUTA Market AI - Frontend Application
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import MarketIntelligence from './pages/MarketIntelligence';
import ProductAnalyzer from './pages/ProductAnalyzer';
import RoiCalculator from './pages/RoiCalculator';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<DashboardOverview />} />
          <Route path="market-intelligence" element={<MarketIntelligence />} />
          <Route path="product-analyzer" element={<ProductAnalyzer />} />
          <Route path="roi-calculator" element={<RoiCalculator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Redirect root to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
