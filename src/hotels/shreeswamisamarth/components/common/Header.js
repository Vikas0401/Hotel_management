import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import './Header.css';

const Header = ({ isAuthenticated, onLogout }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            setUser(getCurrentUser());
        } else {
            setUser(null);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            {/* Signature Line - Only for Shree Swami Samarth Hotel */}
            {isAuthenticated && user?.hotelId === 'shreeswamisamarth' && (
                <div className="signature-line">
                    "श्री स्वामी समर्थ - स्वादिष्ट आणि गुणवत्तापूर्ण जेवण"
                </div>
            )}
            <div className="header-content">
                <Link to="/" className={`logo ${user?.hotelId === 'shreeswamisamarth' ? 'hotel-shreeswamisamarth-name' : ''}`}>
                    🏨 {user?.hotelName || 'Hotel Management System'}
                </Link>
                <nav>
                    <ul className="nav-menu">
                        {/* Only show home link if not on login page and authenticated */}
                        {isAuthenticated && !location.pathname.includes('/home') && !location.pathname.endsWith('/') && (
                            <li><Link to="home">🏠 मुख्यपृष्ठ</Link></li>
                        )}
                        {isAuthenticated && (
                            <>
                                <li><Link to="menu">🛍️ पार्सल ऑर्डर</Link></li>
                                <li><Link to="table-menu">🍽️ टेबल ऑर्डर</Link></li>
                                <li><Link to="table-orders">📋 टेबल व्यवस्थापन</Link></li>
                                <li><Link to="bill">🧾 बिल</Link></li>
                                <li><Link to="bill-history">📊 बिल इतिहास</Link></li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '14px', opacity: '0.8' }}>
                                        स्वागत आहे, {user?.hotelName}
                                    </span>
                                    <button 
                                        onClick={handleLogout}
                                        style={{
                                            background: 'none',
                                            border: '1px solid white',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.color = '#2c3e50';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = 'white';
                                        }}
                                    >
                                        🚪 लॉगआउट
                                    </button>
                                </li>
                            </>
                        )}
                        {!isAuthenticated && (
                            <li><Link to="/login">🔐 Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
