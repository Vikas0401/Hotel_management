import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import TableMenuPage from './pages/TableMenuPage';
import TableOrdersPage from './pages/TableOrdersPage';
import BillPage from './pages/BillPage';
import BillHistoryPage from './pages/BillHistoryPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { isAuthenticated as checkAuth, getCurrentUser, logout } from './services/authService';
import './styles/MatoshreeTheme.css';
import './styles/MarathiFonts.css';

// Main App Content Component
const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in when app loads
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  // Prevent back navigation to protected pages after logout
  useEffect(() => {
    if (!isAuthenticated) {
      const preventBack = (event) => {
        const currentPath = window.location.pathname;
        const protectedPaths = ['/home', '/menu', '/table-menu', '/table-orders', '/bill', '/bill-history'];
        
        // If user is not authenticated and tries to access protected route
        if (protectedPaths.includes(currentPath)) {
          event.preventDefault();
          navigate('/login', { replace: true });
        }
      };

      // Add popstate listener to handle back/forward navigation
      window.addEventListener('popstate', preventBack);
      
      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    // Call the logout service which clears storage and history
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Force navigation to login and replace current history entry
    navigate('/login', { replace: true });
    
    // Clear any remaining navigation history
    window.history.pushState(null, null, '/login');
    
    // Prevent back navigation after logout
    const preventBack = () => {
      window.history.pushState(null, null, '/login');
    };
    
    // Add event listener to prevent back navigation
    window.addEventListener('popstate', preventBack);
    
    // Clean up listener after 1 second (enough time for redirect)
    setTimeout(() => {
      window.removeEventListener('popstate', preventBack);
    }, 1000);
  };

  // Apply Matoshree theme if user is from Matoshree hotel
  const shouldApplyMatoshreeTheme = isAuthenticated && currentUser?.hotelId === 'matoshree';

  return (
    <div className={`app-container ${shouldApplyMatoshreeTheme ? 'matoshree-theme theme-transition' : 'theme-transition'}`}>
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
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/menu" element={isAuthenticated ? <MenuPage /> : <Navigate to="/login" replace />} />
          <Route path="/table-menu" element={isAuthenticated ? <TableMenuPage /> : <Navigate to="/login" replace />} />
          <Route path="/table-orders" element={isAuthenticated ? <TableOrdersPage /> : <Navigate to="/login" replace />} />
          <Route path="/bill" element={isAuthenticated ? <BillPage /> : <Navigate to="/login" replace />} />
          <Route path="/bill-history" element={isAuthenticated ? <BillHistoryPage /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Main App component with Router
const App = () => {
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/Hotel_management' : ''}>
      <AppContent />
    </Router>
  );
};

export default App;