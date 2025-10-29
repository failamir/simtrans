import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { Citizens } from './pages/Citizens';
import { Users } from './pages/Users';
import { Areas } from './pages/Areas';
import { DistributionMap } from './pages/DistributionMap';
import { ScanDetail } from './pages/ScanDetail';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onToggleMode={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggleMode={() => setIsLogin(true)} />
  );
};

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route for scan detail */}
      <Route path="/scan/:id" element={<ScanDetail />} />

      {/* Auth or landing */}
      <Route path="/" element={user ? <Dashboard /> : <AuthPage />} />
      <Route 
        path="/citizens" 
        element={
          user && (user.role === 'admin' || user.role === 'staff') ? 
          <Citizens /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/users" 
        element={
          user && user.role === 'admin' ? 
          <Users /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/areas" 
        element={
          user && (user.role === 'admin' || user.role === 'staff') ? 
          <Areas /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/distribution-map" 
        element={
          user && (user.role === 'admin' || user.role === 'staff') ? 
          <DistributionMap /> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/reports" 
        element={
          user && (user.role === 'admin' || user.role === 'staff') ? 
          <div>Reports Page - Coming Soon</div> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/statistics" 
        element={
          user && (user.role === 'admin' || user.role === 'staff') ? 
          <div>Statistics Page - Coming Soon</div> : 
          <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/settings" 
        element={
          user && user.role === 'admin' ? 
          <div>Settings Page - Coming Soon</div> : 
          <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;