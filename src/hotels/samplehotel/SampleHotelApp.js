import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import TableMenuPage from './pages/TableMenuPage';
import TableOrdersPage from './pages/TableOrdersPage';
import BillPage from './pages/BillPage';
import BillHistoryPage from './pages/BillHistoryPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { isAuthenticated } from './services/authService';
import './styles/Dashboard.css';
import './styles/SampleHotelTheme.css';
import '../../styles/MarathiFonts.css';

const SampleHotelApp = ({ onLogout }) => {
    const isAuth = isAuthenticated();

    return (
        <div className="app samplehotel-theme">
            <Header isAuthenticated={isAuth} onLogout={onLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="table-menu" element={<TableMenuPage />} />
                    <Route path="table-orders" element={<TableOrdersPage />} />
                    <Route path="bill" element={<BillPage />} />
                    <Route path="bill-history" element={<BillHistoryPage />} />
                    <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default SampleHotelApp;