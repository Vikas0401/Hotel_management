import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in when app loads
    setIsLoading(true);
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const user = getCurrentUser();
      setCurrentUser(user);
      
      // Check for auto-export on first day of month
      import('./services/billHistoryService').then(({ autoExportMonthlyReport }) => {
        autoExportMonthlyReport();
      });
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false); // Authentication check complete
  }, []);

  // Note: Removed the automatic redirect logic that was causing refresh issues
  // Protected routes are handled by the route definitions below

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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            fontSize: '18px',
            color: '#2c3e50',
            marginBottom: '10px'
          }}>
            Loading Hotel Management System...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${shouldApplyMatoshreeTheme ? 'matoshree-theme theme-transition' : 'theme-transition'}`}>
      {/* Hide header only on login page */}
      {location.pathname !== '/login' && (
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}
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