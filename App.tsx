
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Layout from './components/Layout';

// @fix: Move ProtectedRoute out of the App component to fix property 'children' missing errors 
// and prevent unnecessary component re-definitions on every render.
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  userEmail: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, userEmail, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout userEmail={userEmail}>{children}</Layout>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('zenwealth_logged_in') === 'true'
  );
  const [userEmail, setUserEmail] = useState<string>(
    localStorage.getItem('zenwealth_user_email') || ''
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('zenwealth_logged_in') === 'true');
      setUserEmail(localStorage.getItem('zenwealth_user_email') || '');
    };
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('db_updated', () => {}); // Just to trigger rerenders if needed
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        {/* @fix: Explicitly pass authentication props to the moved ProtectedRoute component */}
        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Dashboard /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Accounts /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Transactions /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Goals /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Reports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} userEmail={userEmail}><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
