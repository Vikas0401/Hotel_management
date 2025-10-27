import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Common components
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

// Hotel-specific Apps
import MatoshreeApp from './hotels/matoshree/MatoshreeApp';
import JagdambaApp from './hotels/jagdamba/JagdambaApp';
import SampleHotelApp from './hotels/samplehotel/SampleHotelApp';
import ShreeHariApp from './hotels/shreehari/ShreeHariApp';

// Multi-hotel authentication
import { 
    isAuthenticated as checkAuth, 
    getCurrentUser, 
    logout
} from './shared/services/multiHotelAuthService';

// Context and Route Protection
import { HotelProvider } from './shared/services/HotelContext';
import HotelRoute from './shared/components/HotelRoute';

import './styles/MatoshreeTheme.css';
import './styles/MarathiFonts.css';
import './styles/themes.css';
import { ThemeProvider, useTheme } from './shared/services/ThemeContext';

// Main App Content Component
const AppContent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);
        const authStatus = checkAuth();
        setIsAuthenticated(authStatus);
        
        if (authStatus) {
            const user = getCurrentUser();
            setCurrentUser(user);
            
            // Auto-redirect to hotel-specific dashboard if on root path
            if (location.pathname === '/' && user) {
                navigate(`/hotels/${user.hotelId}`, { replace: true });
            }
            
            // Check for auto-export on first day of month (for bills)
            import('./services/billHistoryService').then(({ autoExportMonthlyReport }) => {
                autoExportMonthlyReport();
            }).catch(() => {
                // Ignore if service doesn't exist
            });
        } else {
            setCurrentUser(null);
        }
        setIsLoading(false);
    }, [location.pathname, navigate]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        const user = getCurrentUser();
        setCurrentUser(user);
        
        // Redirect to hotel-specific dashboard after login
        if (user) {
            navigate(`/hotels/${user.hotelId}`, { replace: true });
        }
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        navigate('/login', { replace: true });
        
        // Prevent back navigation after logout
        window.history.pushState(null, null, '/login');
        const preventBack = () => {
            window.history.pushState(null, null, '/login');
        };
        window.addEventListener('popstate', preventBack);
        setTimeout(() => {
            window.removeEventListener('popstate', preventBack);
        }, 1000);
    };

    // Theme hook (only inside ThemeProvider) - must be before any conditional returns
    const { theme } = useTheme();

    // Show loading screen while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e3e3e3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <h2 style={{ color: '#333', margin: 0 }}>हॉटेल व्यवस्थापन प्रणाली लोड करत आहे...</h2>
                    <p style={{ color: '#666', margin: '0.5rem 0 0' }}>कृपया थांबा...</p>
                </div>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className={`app theme-${theme}`}>
            <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                
                {/* Hotel-specific Routes */}
                <Route path="/hotels/matoshree/*" element={
                    <HotelRoute>
                        <MatoshreeApp onLogout={handleLogout} />
                    </HotelRoute>
                } />
                
                <Route path="/hotels/jagdamba/*" element={
                    <HotelRoute>
                        <JagdambaApp onLogout={handleLogout} />
                    </HotelRoute>
                } />
                
                <Route path="/hotels/shreehari/*" element={
                    <HotelRoute>
                        <ShreeHariApp onLogout={handleLogout} />
                    </HotelRoute>
                } />
                
                <Route path="/hotels/samplehotel/*" element={
                    <HotelRoute>
                        <SampleHotelApp onLogout={handleLogout} />
                    </HotelRoute>
                } />
                
                {/* Fallback redirect */}
                <Route path="*" element={
                    isAuthenticated && currentUser ? 
                        <Navigate to={`/hotels/${currentUser.hotelId}`} replace /> :
                        <Navigate to="/login" replace />
                } />
            </Routes>
        </div>
    );
};

// Main App Component with Router and Context
const App = () => {
    return (
        <Router>
            <HotelProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </HotelProvider>
        </Router>
    );
};

export default App;