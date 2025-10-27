import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { isAuthenticated, logout } from './services/authService';
import './styles/Dashboard.css';
import '../../styles/MatoshreeTheme.css';
import '../../styles/MarathiFonts.css';

const SampleHotelApp = ({ onLogout }) => {
    const isAuth = isAuthenticated();

    const handleLogout = () => {
        logout();
        if (onLogout) onLogout();
    };

    return (
        <div className="app sample-theme">
            <Header isAuthenticated={isAuth} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="login" element={<LoginPage />} />
                    {isAuth ? (
                        <>
                            <Route path="home" element={<HomePage />} />
                            <Route path="menu" element={<MenuPage />} />
                            <Route path="table-menu" element={<TableMenuPage />} />
                            <Route path="table-orders" element={<TableOrdersPage />} />
                            <Route path="bill" element={<BillPage />} />
                            <Route path="bill-history" element={<BillHistoryPage />} />
                            <Route path="*" element={<Navigate to="home" replace />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    )}
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default SampleHotelApp;
