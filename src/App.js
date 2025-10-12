import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import BillPage from './pages/BillPage';
import BillHistoryPage from './pages/BillHistoryPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { isAuthenticated as checkAuth, getCurrentUser } from './services/authService';
import './styles/MatoshreeTheme.css';
import './styles/MarathiFonts.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in when app loads
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Apply Matoshree theme if user is from Matoshree hotel
  const shouldApplyMatoshreeTheme = isAuthenticated && currentUser?.hotelId === 'matoshree';

  return (
    <div className={`app-container ${shouldApplyMatoshreeTheme ? 'matoshree-theme theme-transition' : 'theme-transition'}`}>
      <Router basename={process.env.NODE_ENV === 'production' ? '/Hotel_management' : ''}>
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard - Main landing page */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route path="/home" element={isAuthenticated ? <HomePage /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/menu" element={isAuthenticated ? <MenuPage /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/bill" element={isAuthenticated ? <BillPage /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/bill-history" element={isAuthenticated ? <BillHistoryPage /> : <LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;